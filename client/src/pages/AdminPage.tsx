import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Search,
  ShieldCheck,
  RotateCcw,
  X,
  Trash2,
  Plus,
  Boxes,
  Menu,
  Users,
  CalendarDays,
  Trophy,
  Pencil,
} from "lucide-react";
import { supabase } from "../supabaseClient";

type RequestStatus = "pending" | "approved" | "rejected" | "returned";
type AdminView = "requests" | "inventory" | "coreMembers" | "events" | "achievements" | "fines" | "createAdmins" | "changeIdPassword";
type AdminPermission = "requests" | "inventory" | "coreMembers" | "events" | "achievements" | "fines";

const SUPER_ADMIN_DEFAULT_USERNAME = "robostreaks@12345";
const SUPER_ADMIN_DEFAULT_PASSWORD = "Robomania@12345";
const ADMIN_AUTH_KEY = "robostreaks-admin-auth";
const ADMIN_SESSION_USER_KEY = "robostreaks-admin-session-user";
const ADMIN_SUPER_CREDENTIALS_KEY = "robostreaks-super-admin-credentials";
const ADMIN_CREATED_ACCOUNTS_KEY = "robostreaks-created-admins";
const ADMIN_FINES_KEY = "robostreaks-fine-entries";
const ALL_PERMISSIONS: AdminPermission[] = ["requests", "inventory", "coreMembers", "events", "achievements", "fines"];

const normalizeUsername = (value: string) => value.trim().toLowerCase();

const getSuperAdminCredentials = () => {
  try {
    const raw = localStorage.getItem(ADMIN_SUPER_CREDENTIALS_KEY);
    if (!raw) {
      return {
        username: SUPER_ADMIN_DEFAULT_USERNAME,
        password: SUPER_ADMIN_DEFAULT_PASSWORD,
      };
    }

    const parsed = JSON.parse(raw) as { username?: string; password?: string };
    const username = typeof parsed.username === "string" && parsed.username.trim().length > 0
      ? normalizeUsername(parsed.username)
      : SUPER_ADMIN_DEFAULT_USERNAME;
    const password = typeof parsed.password === "string" && parsed.password.trim().length > 0
      ? parsed.password.trim()
      : SUPER_ADMIN_DEFAULT_PASSWORD;

    return {
      username,
      password,
    };
  } catch {
    return {
      username: SUPER_ADMIN_DEFAULT_USERNAME,
      password: SUPER_ADMIN_DEFAULT_PASSWORD,
    };
  }
};

interface CreatedAdminAccount {
  username: string;
  password: string;
  permissions: AdminPermission[];
  createdAt: string;
  isActive: boolean;
  removedAt?: string;
}

interface SessionAdminUser {
  username: string;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
}

interface FineEntry {
  id: string;
  name: string;
  regdNo: string;
  branch: string;
  year: string;
  fineDate: string;
  componentName: string;
  whatHappened: string;
  amount: number;
  createdAt: string;
  status?: "pending" | "paid";
  handledBy?: string;
  paidRemarks?: string;
  paidAt?: string;
}

const getCreatedAdminAccounts = () => {
  try {
    const raw = localStorage.getItem(ADMIN_CREATED_ACCOUNTS_KEY);
    if (!raw) {
      return [] as CreatedAdminAccount[];
    }

    const parsed = JSON.parse(raw) as CreatedAdminAccount[];
    if (!Array.isArray(parsed)) {
      return [] as CreatedAdminAccount[];
    }

    return parsed
      .map((item) => ({
        username: normalizeUsername(String(item.username ?? "")),
        password: String(item.password ?? ""),
        permissions: Array.isArray(item.permissions)
          ? item.permissions.filter((permission): permission is AdminPermission =>
              ALL_PERMISSIONS.includes(permission as AdminPermission),
            )
          : [],
        createdAt: String(item.createdAt ?? new Date().toISOString()),
        isActive: item.isActive !== false,
        removedAt: typeof item.removedAt === "string" ? item.removedAt : undefined,
      }))
      .filter((item) => item.username && item.password);
  } catch {
    return [] as CreatedAdminAccount[];
  }
};

const getSavedSessionUser = () => {
  try {
    const isAuthenticated = sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
    if (!isAuthenticated) {
      return null as SessionAdminUser | null;
    }
    const raw = sessionStorage.getItem(ADMIN_SESSION_USER_KEY);
    if (!raw) {
      return null as SessionAdminUser | null;
    }

    const parsed = JSON.parse(raw) as SessionAdminUser;
    if (!parsed || typeof parsed.username !== "string") {
      return null as SessionAdminUser | null;
    }

    return {
      username: normalizeUsername(parsed.username),
      isSuperAdmin: Boolean(parsed.isSuperAdmin),
      permissions: Array.isArray(parsed.permissions)
        ? parsed.permissions.filter((permission): permission is AdminPermission =>
            ALL_PERMISSIONS.includes(permission as AdminPermission),
          )
        : [],
    } as SessionAdminUser;
  } catch {
    return null as SessionAdminUser | null;
  }
};

const getSavedFineEntries = () => {
  try {
    const raw = localStorage.getItem(ADMIN_FINES_KEY);
    if (!raw) {
      return [] as FineEntry[];
    }

    const parsed = JSON.parse(raw) as FineEntry[];
    if (!Array.isArray(parsed)) {
      return [] as FineEntry[];
    }

    return parsed
      .map((item) => ({
        id: String(item.id ?? ""),
        name: String(item.name ?? ""),
        regdNo: String(item.regdNo ?? ""),
        branch: String(item.branch ?? ""),
        year: String(item.year ?? ""),
        fineDate: String(item.fineDate ?? ""),
        componentName: String(item.componentName ?? ""),
        whatHappened: String(item.whatHappened ?? ""),
        amount: Number(item.amount ?? 0),
        createdAt: String(item.createdAt ?? new Date().toISOString()),
        status: item.status === "paid" ? "paid" : "pending",
        handledBy: item.handledBy ? String(item.handledBy) : undefined,
        paidRemarks: item.paidRemarks ? String(item.paidRemarks) : undefined,
        paidAt: item.paidAt ? String(item.paidAt) : undefined,
      }))
      .filter((item) => item.id && item.name && item.regdNo);
  } catch {
    return [] as FineEntry[];
  }
};

interface IssueRequest {
  id: string;
  studentName: string;
  clubRegNo: string;
  phoneNumber: string;
  emailAddress: string;
  purposeOfIssue: string;
  returnDate: string;
  quantity: number;
  componentName: string;
  date: string;
  status: RequestStatus;
  handledBy: string;
  handledAt: string;
}

interface InventoryComponent {
  id: string;
  name: string;
  imageUrl: string;
  totalStock: number;
}

interface CoreMember {
  id: string;
  name: string;
  branch: string;
  position: string;
  imageUrl: string;
}

interface AdminEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  imageUrl: string;
}

interface AchievementItem {
  id: string;
  eventName: string;
  date: string;
  position: string;
  place: string;
  description: string;
}

interface ComponentRow {
  id: string;
  name: string;
  pic_link: string | null;
  total_stock: number | null;
}

interface ComponentStatusRow {
  id: string;
  student_name: string;
  club_reg_no: string | null;
  phone_number: string | null;
  email_address: string | null;
  purpose_of_issue: string | null;
  return_date: string | null;
  quantity: number | null;
  status: RequestStatus;
  handled_by: string | null;
  handled_at: string | null;
  request_date: string | null;
  component_id: string | null;
  components_list: { name: string } | { name: string }[] | null;
}

interface MemberRow {
  id: string;
  name: string;
  branch: string;
  position: string;
  pic_link: string | null;
}

interface EventRow {
  id: string;
  event_name: string;
  event_date: string | null;
  description: string | null;
  pic_link: string | null;
}

interface AchievementRow {
  id: string;
  achievement_name: string;
  event_date: string | null;
  position: string | null;
  event_place: string | null;
  description: string | null;
}

const initialRequests: IssueRequest[] = [
  {
    id: "req-101",
    studentName: "Aarav Sharma",
    componentName: "Arduino Uno R3",
    date: "2026-04-19",
    status: "pending",
  },
  {
    id: "req-102",
    studentName: "Mira Patel",
    componentName: "HC-SR04 Ultrasonic Sensor",
    date: "2026-04-18",
    status: "pending",
  },
  {
    id: "req-103",
    studentName: "Ishaan Gupta",
    componentName: "L298N Motor Driver",
    date: "2026-04-17",
    status: "approved",
  },
  {
    id: "req-104",
    studentName: "Riya Das",
    componentName: "ESP32 Dev Board",
    date: "2026-04-16",
    status: "rejected",
  },
  {
    id: "req-105",
    studentName: "Neel Roy",
    componentName: "TowerPro SG90 Servo",
    date: "2026-04-15",
    status: "returned",
  },
];

const initialComponents: InventoryComponent[] = [
  {
    id: "cmp-1",
    name: "Raspberry Pi 4",
    imageUrl: "https://images.unsplash.com/photo-1591799265444-d66432b91588?w=640",
  },
  {
    id: "cmp-2",
    name: "N20 Geared Motor",
    imageUrl: "https://images.unsplash.com/photo-1581092580507-e0d23cbdf1dc?w=640",
  },
  {
    id: "cmp-3",
    name: "LiPo Battery 3S",
    imageUrl: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=640",
  },
];

const initialCoreMembers: CoreMember[] = [
  {
    id: "core-1",
    name: "Aditya Pradhan",
    branch: "Mechanical",
    position: "President",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=640",
  },
];

const initialEvents: AdminEvent[] = [
  {
    id: "event-1",
    name: "Robo Bootcamp 2026",
    date: "2026-04-20",
    description: "Hands-on workshop covering electronics basics and line follower bot assembly.",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640",
  },
];

const initialAchievements: AchievementItem[] = [
  {
    id: "ach-1",
    eventName: "State Robotics Challenge",
    date: "2026-03-10",
    position: "1st Place",
    place: "Bhubaneswar",
    description: "Won autonomous maze navigation challenge among 35 teams.",
  },
];

const tabConfig: { key: RequestStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "returned", label: "Returned" },
];

const badgeClassByStatus: Record<RequestStatus, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/50",
  approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
  rejected: "bg-rose-500/20 text-rose-300 border-rose-500/50",
  returned: "bg-cyan-500/20 text-cyan-300 border-cyan-500/50",
};

const isRequestStatus = (value: string): value is RequestStatus => {
  return value === "pending" || value === "approved" || value === "rejected" || value === "returned";
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  return value.replace("T", " ").slice(0, 16);
};

const getComponentName = (componentRef: ComponentStatusRow["components_list"]) => {
  if (Array.isArray(componentRef)) {
    return componentRef[0]?.name ?? "Unknown Component";
  }

  if (componentRef && typeof componentRef === "object") {
    return componentRef.name;
  }

  return "Unknown Component";
};

const AddComponentModal = ({
  isOpen,
  onClose,
  name,
  imageUrl,
  quantity,
  onNameChange,
  onImageUrlChange,
  onQuantityChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  imageUrl: string;
  quantity: string;
  onNameChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Add Component</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
            aria-label="Close add component modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Component Name</label>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="Example: TB6612FNG Motor Driver"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Image URL/Link</label>
            <input
              value={imageUrl}
              onChange={(event) => onImageUrlChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Total Stock</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => onQuantityChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="10"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const EditComponentModal = ({
  isOpen,
  onClose,
  name,
  imageUrl,
  quantity,
  onNameChange,
  onImageUrlChange,
  onQuantityChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  imageUrl: string;
  quantity: string;
  onNameChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Edit Component</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
            aria-label="Close edit component modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Component Name</label>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="Example: TB6612FNG Motor Driver"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Image URL/Link</label>
            <input
              value={imageUrl}
              onChange={(event) => onImageUrlChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Total Stock</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => onQuantityChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500"
              placeholder="10"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const FineEntryModal = ({
  isOpen,
  onClose,
  name,
  regdNo,
  branch,
  year,
  fineDate,
  componentName,
  whatHappened,
  amount,
  error,
  success,
  onNameChange,
  onRegdNoChange,
  onBranchChange,
  onYearChange,
  onFineDateChange,
  onComponentNameChange,
  onWhatHappenedChange,
  onAmountChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  regdNo: string;
  branch: string;
  year: string;
  fineDate: string;
  componentName: string;
  whatHappened: string;
  amount: string;
  error: string;
  success: string;
  onNameChange: (value: string) => void;
  onRegdNoChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onFineDateChange: (value: string) => void;
  onComponentNameChange: (value: string) => void;
  onWhatHappenedChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Add Fine Entry</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
            aria-label="Close add fine modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Student name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Regd No</label>
            <input
              value={regdNo}
              onChange={(event) => onRegdNoChange(event.target.value)}
              placeholder="Registration number"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Branch</label>
            <input
              value={branch}
              onChange={(event) => onBranchChange(event.target.value)}
              placeholder="Branch"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Year</label>
            <input
              value={year}
              onChange={(event) => onYearChange(event.target.value)}
              placeholder="Year"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Date</label>
            <input
              type="date"
              value={fineDate}
              onChange={(event) => onFineDateChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Rs fined</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="Amount"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-200">Component Name</label>
            <input
              value={componentName}
              onChange={(event) => onComponentNameChange(event.target.value)}
              placeholder="Component name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-200">What happened</label>
            <textarea
              value={whatHappened}
              onChange={(event) => onWhatHappenedChange(event.target.value)}
              placeholder="Short description"
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          {error ? <p className="md:col-span-2 text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="md:col-span-2 text-sm text-emerald-300">{success}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCoreMemberModal = ({
  isOpen,
  onClose,
  name,
  branch,
  position,
  imageUrl,
  onNameChange,
  onBranchChange,
  onPositionChange,
  onImageUrlChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  branch: string;
  position: string;
  imageUrl: string;
  onNameChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Add Core Member</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Wing / Branch</label>
            <input
              value={branch}
              onChange={(e) => onBranchChange(e.target.value)}
              placeholder="(optional)"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Position</label>
            <input
              value={position}
              onChange={(e) => onPositionChange(e.target.value)}
              placeholder="Position"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Picture Link</label>
            <input
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="(optional)"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
};

const AddEventModal = ({
  isOpen,
  onClose,
  name,
  date,
  description,
  imageUrl,
  onNameChange,
  onDateChange,
  onDescriptionChange,
  onImageUrlChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  onNameChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Add Event</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Event Name</label>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Event Name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-200">Picture Link</label>
            <input
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="Event Pic Link"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Event details description"
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

const AddAchievementModal = ({
  isOpen,
  onClose,
  eventName,
  date,
  position,
  place,
  description,
  onEventNameChange,
  onDateChange,
  onPositionChange,
  onPlaceChange,
  onDescriptionChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  date: string;
  position: string;
  place: string;
  description: string;
  onEventNameChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onPlaceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Add Achievement</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Event Name</label>
            <input
              value={eventName}
              onChange={(e) => onEventNameChange(e.target.value)}
              placeholder="Event Name"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Position</label>
            <input
              value={position}
              onChange={(e) => onPositionChange(e.target.value)}
              placeholder="Position"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Event Place</label>
            <input
              value={place}
              onChange={(e) => onPlaceChange(e.target.value)}
              placeholder="Event Place"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Small details description"
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateAdminModal = ({
  isOpen,
  onClose,
  username,
  confirmUsername,
  password,
  confirmPassword,
  permissions,
  error,
  onUsernameChange,
  onConfirmUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePermission,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  confirmUsername: string;
  password: string;
  confirmPassword: string;
  permissions: AdminPermission[];
  error: string;
  onUsernameChange: (value: string) => void;
  onConfirmUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePermission: (permission: AdminPermission) => void;
  onSubmit: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Create Admin Account</h3>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
            <input
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="Username"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Username</label>
            <input
              value={confirmUsername}
              onChange={(e) => onConfirmUsernameChange(e.target.value)}
              placeholder="Confirm Username"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-slate-200">What functions they can do:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                <input type="checkbox" checked={permissions.includes("requests")} onChange={() => onTogglePermission("requests")} className="h-4 w-4 accent-cyan-500" />
                Request Management
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                <input type="checkbox" checked={permissions.includes("inventory")} onChange={() => onTogglePermission("inventory")} className="h-4 w-4 accent-cyan-500" />
                Inventory Control
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                <input type="checkbox" checked={permissions.includes("coreMembers")} onChange={() => onTogglePermission("coreMembers")} className="h-4 w-4 accent-cyan-500" />
                Add Core Member
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                <input type="checkbox" checked={permissions.includes("events")} onChange={() => onTogglePermission("events")} className="h-4 w-4 accent-cyan-500" />
                Events
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 sm:col-span-2">
                <input type="checkbox" checked={permissions.includes("achievements")} onChange={() => onTogglePermission("achievements")} className="h-4 w-4 accent-cyan-500" />
                Achievements
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 sm:col-span-2">
                <input type="checkbox" checked={permissions.includes("fines")} onChange={() => onTogglePermission("fines")} className="h-4 w-4 accent-cyan-500" />
                Fine Management
              </label>
            </div>
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-3">Confirm Deletion</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [superAdminCredentials, setSuperAdminCredentials] = useState(() => getSuperAdminCredentials());
  const [createdAdminAccounts, setCreatedAdminAccounts] = useState<CreatedAdminAccount[]>(() => getCreatedAdminAccounts());
  const [currentAdminUser, setCurrentAdminUser] = useState<SessionAdminUser | null>(() => getSavedSessionUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(ADMIN_AUTH_KEY) === "true");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [oldUsernameInput, setOldUsernameInput] = useState("");
  const [newUsernameInput, setNewUsernameInput] = useState("");
  const [confirmUsernameInput, setConfirmUsernameInput] = useState("");
  const [usernameChangePasswordInput, setUsernameChangePasswordInput] = useState("");
  const [usernameChangeError, setUsernameChangeError] = useState("");
  const [usernameChangeSuccess, setUsernameChangeSuccess] = useState("");
  const [passwordChangeUsernameInput, setPasswordChangeUsernameInput] = useState("");
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminUsername, setConfirmAdminUsername] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermission[]>([]);
  const [createAdminError, setCreateAdminError] = useState("");
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [createAdminSuccess, setCreateAdminSuccess] = useState("");
  const [currentView, setCurrentView] = useState<AdminView>("requests");
  const [activeTab, setActiveTab] = useState<RequestStatus>("pending");
  const [requestSearch, setRequestSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [coreMemberSearch, setCoreMemberSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [achievementSearch, setAchievementSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fineSearch, setFineSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [fineEntries, setFineEntries] = useState<FineEntry[]>(() => getSavedFineEntries());
  const [fineName, setFineName] = useState("");
  const [fineRegdNo, setFineRegdNo] = useState("");
  const [fineBranch, setFineBranch] = useState("");
  const [fineYear, setFineYear] = useState("");
  const [fineDate, setFineDate] = useState("");
  const [fineComponentName, setFineComponentName] = useState("");
  const [fineWhatHappened, setFineWhatHappened] = useState("");
  const [fineAmount, setFineAmount] = useState("");
  const [fineError, setFineError] = useState("");
  const [fineSuccess, setFineSuccess] = useState("");
  const [isAddFineOpen, setIsAddFineOpen] = useState(false);
  const [payingFineId, setPayingFineId] = useState<string | null>(null);
  const [payingRemarks, setPayingRemarks] = useState("");
  const [fineToDelete, setFineToDelete] = useState<{ id: string; name: string } | null>(null);

  const [requests, setRequests] = useState<IssueRequest[]>([]);
  const [components, setComponents] = useState<InventoryComponent[]>([]);
  const [coreMembers, setCoreMembers] = useState<CoreMember[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newComponentName, setNewComponentName] = useState("");
  const [newComponentImageUrl, setNewComponentImageUrl] = useState("");
  const [newComponentQuantity, setNewComponentQuantity] = useState("1");

  const [isEditComponentModalOpen, setIsEditComponentModalOpen] = useState(false);
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editComponentName, setEditComponentName] = useState("");
  const [editComponentImageUrl, setEditComponentImageUrl] = useState("");
  const [editComponentQuantity, setEditComponentQuantity] = useState("1");

  const [isAddCoreMemberOpen, setIsAddCoreMemberOpen] = useState(false);
  const [coreMemberName, setCoreMemberName] = useState("");
  const [coreMemberBranch, setCoreMemberBranch] = useState("");
  const [coreMemberPosition, setCoreMemberPosition] = useState("");
  const [coreMemberImageUrl, setCoreMemberImageUrl] = useState("");

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");

  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [achievementEventName, setAchievementEventName] = useState("");
  const [achievementDate, setAchievementDate] = useState("");
  const [achievementPosition, setAchievementPosition] = useState("");
  const [achievementPlace, setAchievementPlace] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");

  const isSuperAdmin = currentAdminUser?.isSuperAdmin === true;
  const allowedViews = isSuperAdmin
    ? (["requests", "inventory", "coreMembers", "events", "achievements", "fines", "createAdmins", "changeIdPassword"] as AdminView[])
    : (currentAdminUser?.permissions ?? []);

  const canAccessView = (view: AdminView) => {
    if (isSuperAdmin) {
      return true;
    }
    if (view === "createAdmins") {
      return false;
    }
    return allowedViews.includes(view);
  };

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(ADMIN_AUTH_KEY) === "true");
  }, []);

  useEffect(() => {
    if (isAuthenticated && !currentAdminUser) {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
      setIsAuthenticated(false);
    }
  }, [currentAdminUser, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !currentAdminUser) {
      return;
    }

    if (!canAccessView(currentView)) {
      setCurrentView((allowedViews[0] ?? "requests") as AdminView);
    }
  }, [allowedViews, currentAdminUser, currentView, isAuthenticated]);

  const purgeExpiredRequests = async () => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    const cutoffIso = cutoffDate.toISOString();

    const [rejectedCleanup, returnedCleanup] = await Promise.all([
      supabase.from("component_status").delete().eq("status", "rejected").lt("request_date", cutoffIso),
      supabase.from("component_status").delete().eq("status", "returned").lt("return_date", cutoffIso),
    ]);

    if (rejectedCleanup.error || returnedCleanup.error) {
      console.warn("Failed to auto-clean old rejected/returned requests", rejectedCleanup.error || returnedCleanup.error);
    }
  };

  const loadAdminData = async () => {
    setIsSyncing(true);
    setSyncError("");

    await purgeExpiredRequests();

    const [componentsResult, requestsResult, membersResult, eventsResult, achievementsResult] = await Promise.all([
      supabase.from("components_list").select("id, name, pic_link, total_stock").order("created_at", { ascending: false }),
      supabase
        .from("component_status")
        .select(
          "id, student_name, club_reg_no, phone_number, email_address, purpose_of_issue, return_date, quantity, status, handled_by, handled_at, request_date, component_id, components_list(name)",
        )
        .order("request_date", { ascending: false }),
      supabase.from("members").select("id, name, branch, position, pic_link").order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select("id, event_name, event_date, description, pic_link")
        .order("created_at", { ascending: false }),
      supabase
        .from("achievements")
        .select("id, achievement_name, event_date, position, event_place, description")
        .order("created_at", { ascending: false }),
    ]);

    const firstError =
      componentsResult.error ||
      requestsResult.error ||
      membersResult.error ||
      eventsResult.error ||
      achievementsResult.error;

    if (firstError) {
      setSyncError(firstError.message);
      setIsSyncing(false);
      return;
    }

    const componentRows = (componentsResult.data ?? []) as ComponentRow[];
    const requestRows = (requestsResult.data ?? []) as ComponentStatusRow[];
    const memberRows = (membersResult.data ?? []) as MemberRow[];
    const eventRows = (eventsResult.data ?? []) as EventRow[];
    const achievementRows = (achievementsResult.data ?? []) as AchievementRow[];

    setComponents(
      componentRows.map((component) => ({
        id: component.id,
        name: component.name,
        imageUrl: component.pic_link ?? "",
        totalStock: Number(component.total_stock ?? 1),
      })),
    );

    setRequests(
      requestRows.map((request) => ({
        id: request.id,
        studentName: request.student_name,
        clubRegNo: request.club_reg_no ?? "",
        phoneNumber: request.phone_number ?? "",
        emailAddress: request.email_address ?? "",
        purposeOfIssue: request.purpose_of_issue ?? "",
        returnDate: formatDate(request.return_date),
        quantity: request.quantity ?? 1,
        componentName: getComponentName(request.components_list),
        date: formatDate(request.request_date),
        status: isRequestStatus(request.status) ? request.status : "pending",
        handledBy: request.handled_by ?? "",
        handledAt: formatDateTime(request.handled_at),
      })),
    );

    setCoreMembers(
      memberRows.map((member) => ({
        id: member.id,
        name: member.name,
        branch: member.branch,
        position: member.position,
        imageUrl: member.pic_link ?? "",
      })),
    );

    setEvents(
      eventRows.map((eventItem) => ({
        id: eventItem.id,
        name: eventItem.event_name,
        date: eventItem.event_date ?? "",
        description: eventItem.description ?? "",
        imageUrl: eventItem.pic_link ?? "",
      })),
    );

    setAchievements(
      achievementRows.map((achievement) => ({
        id: achievement.id,
        eventName: achievement.achievement_name,
        date: achievement.event_date ?? "",
        position: achievement.position ?? "",
        place: achievement.event_place ?? "",
        description: achievement.description ?? "",
      })),
    );

    setIsSyncing(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void loadAdminData();
  }, [isAuthenticated]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = normalizeUsername(loginUsername);
    const password = loginPassword.trim();

    const isSuperAdminLogin =
      username === normalizeUsername(superAdminCredentials.username) &&
      password === superAdminCredentials.password;

    if (isSuperAdminLogin) {
      const superAdminUser: SessionAdminUser = {
        username,
        isSuperAdmin: true,
        permissions: ALL_PERMISSIONS,
      };
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(superAdminUser));
      setCurrentAdminUser(superAdminUser);
      setIsAuthenticated(true);
      setLoginError("");
      setLoginPassword("");
      return;
    }

    const matchedAdmin = createdAdminAccounts.find(
      (account) => account.username === username && account.password === password && account.isActive,
    );

    if (matchedAdmin) {
      const adminUser: SessionAdminUser = {
        username: matchedAdmin.username,
        isSuperAdmin: false,
        permissions: matchedAdmin.permissions,
      };
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(adminUser));
      setCurrentAdminUser(adminUser);
      setCurrentView((matchedAdmin.permissions[0] ?? "requests") as AdminView);
      setIsAuthenticated(true);
      setLoginError("");
      setLoginPassword("");
      return;
    }

    setLoginError("Invalid username or password.");
  };

  const handleUsernameUpdate = () => {

    const oldUsername = normalizeUsername(oldUsernameInput);
    const newUsername = normalizeUsername(newUsernameInput);
    const confirmUsername = normalizeUsername(confirmUsernameInput);
    const password = usernameChangePasswordInput.trim();

    setUsernameChangeError("");
    setUsernameChangeSuccess("");

    if (!oldUsername || !newUsername || !confirmUsername || !password) {
      setUsernameChangeError("Please fill all username change fields.");
      return;
    }

    if (!isSuperAdmin) {
      setUsernameChangeError("Only super admin can change super admin credentials.");
      return;
    }

    if (oldUsername !== normalizeUsername(superAdminCredentials.username) || password !== superAdminCredentials.password) {
      setUsernameChangeError("Old username or password is incorrect.");
      return;
    }

    if (newUsername !== confirmUsername) {
      setUsernameChangeError("New username and confirm username must match.");
      return;
    }

    const updatedCredentials = { ...superAdminCredentials, username: newUsername };
    setSuperAdminCredentials(updatedCredentials);

    localStorage.setItem(
      ADMIN_SUPER_CREDENTIALS_KEY,
      JSON.stringify(updatedCredentials),
    );

    const updatedSessionUser: SessionAdminUser = {
      username: newUsername,
      isSuperAdmin: true,
      permissions: ALL_PERMISSIONS,
    };
    setCurrentAdminUser(updatedSessionUser);
    sessionStorage.setItem(ADMIN_SESSION_USER_KEY, JSON.stringify(updatedSessionUser));

    setOldUsernameInput("");
    setNewUsernameInput("");
    setConfirmUsernameInput("");
    setUsernameChangePasswordInput("");
    setUsernameChangeSuccess("Username successfully changed.");
  };

  const handlePasswordUpdate = () => {

    const username = normalizeUsername(passwordChangeUsernameInput);
    const oldPassword = oldPasswordInput.trim();
    const newPassword = newPasswordInput.trim();
    const confirmPassword = confirmPasswordInput.trim();

    setPasswordChangeError("");
    setPasswordChangeSuccess("");

    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      setPasswordChangeError("Please fill all password change fields.");
      return;
    }

    if (!isSuperAdmin) {
      setPasswordChangeError("Only super admin can change super admin credentials.");
      return;
    }

    if (username !== normalizeUsername(superAdminCredentials.username) || oldPassword !== superAdminCredentials.password) {
      setPasswordChangeError("Username or old password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New password and confirm password must match.");
      return;
    }

    const updatedCredentials = { ...superAdminCredentials, password: newPassword };
    setSuperAdminCredentials(updatedCredentials);

    localStorage.setItem(
      ADMIN_SUPER_CREDENTIALS_KEY,
      JSON.stringify(updatedCredentials),
    );

    setPasswordChangeUsernameInput("");
    setOldPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
    setPasswordChangeSuccess("Password successfully changed.");
  };

  const togglePermissionSelection = (permission: AdminPermission) => {
    setNewAdminPermissions((previous) =>
      previous.includes(permission)
        ? previous.filter((item) => item !== permission)
        : [...previous, permission],
    );
  };

  const createAdminAccount = () => {
    const username = normalizeUsername(newAdminUsername);
    const confirmUsername = normalizeUsername(confirmAdminUsername);
    const password = newAdminPassword.trim();
    const confirmPassword = confirmAdminPassword.trim();

    setCreateAdminError("");
    setCreateAdminSuccess("");

    if (!isSuperAdmin) {
      setCreateAdminError("Only super admin can create admins.");
      return;
    }

    if (!username || !confirmUsername || !password || !confirmPassword) {
      setCreateAdminError("Please fill all fields for new admin.");
      return;
    }

    if (username !== confirmUsername) {
      setCreateAdminError("Username and confirm username must match.");
      return;
    }

    if (password !== confirmPassword) {
      setCreateAdminError("Password and confirm password must match.");
      return;
    }

    if (normalizeUsername(superAdminCredentials.username) === username) {
      setCreateAdminError("This username is reserved for super admin.");
      return;
    }

    if (createdAdminAccounts.some((account) => account.username === username)) {
      setCreateAdminError("An admin with this username already exists.");
      return;
    }

    if (newAdminPermissions.length === 0) {
      setCreateAdminError("Select at least one permission.");
      return;
    }

    const updatedAccounts: CreatedAdminAccount[] = [
      {
        username,
        password,
        permissions: Array.from(new Set(newAdminPermissions)),
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      ...createdAdminAccounts,
    ];

    setCreatedAdminAccounts(updatedAccounts);
    localStorage.setItem(ADMIN_CREATED_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));

    setNewAdminUsername("");
    setConfirmAdminUsername("");
    setNewAdminPassword("");
    setConfirmAdminPassword("");
    setNewAdminPermissions([]);
    setCreateAdminSuccess("Admin account created successfully.");
    setIsCreateAdminOpen(false);
  };

  const handleMarkFinePaid = (id: string) => {
    if (!payingRemarks.trim()) {
      alert("Please enter remarks (e.g., Component returned, Payment done).");
      return;
    }
    const updatedEntries = fineEntries.map((entry) => {
      if (entry.id === id) {
        return {
          ...entry,
          status: "paid" as const,
          handledBy: currentAdminUser?.username ?? superAdminCredentials.username,
          paidRemarks: payingRemarks.trim(),
          paidAt: new Date().toISOString(),
        };
      }
      return entry;
    });

    setFineEntries(updatedEntries);
    localStorage.setItem(ADMIN_FINES_KEY, JSON.stringify(updatedEntries));
    setPayingFineId(null);
    setPayingRemarks("");
  };

  const deleteFineEntry = (id: string, name: string) => {
    if (!isSuperAdmin) {
      alert("Only super admin can delete fine entries.");
      return;
    }

    setFineToDelete({ id, name });
  };

  const confirmDeleteFine = () => {
    if (!fineToDelete) return;
    
    const updatedEntries = fineEntries.filter((entry) => entry.id !== fineToDelete.id);
    setFineEntries(updatedEntries);
    localStorage.setItem(ADMIN_FINES_KEY, JSON.stringify(updatedEntries));
    setFineToDelete(null);
  };

  const deleteAdminAccount = (username: string) => {
    if (!isSuperAdmin) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the admin account for "${username}"? This action cannot be undone.`)) {
      return;
    }

    const updatedAccounts = createdAdminAccounts.filter((account) => account.username !== username);
    setCreatedAdminAccounts(updatedAccounts);
    localStorage.setItem(ADMIN_CREATED_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  };

  const addFineEntry = () => {
    const parsedAmount = Number(fineAmount);

    setFineError("");
    setFineSuccess("");

    if (!fineName.trim() || !fineRegdNo.trim() || !fineBranch.trim() || !fineYear.trim() || !fineDate || !fineComponentName.trim() || !fineWhatHappened.trim()) {
      setFineError("Please fill all fine fields.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFineError("Fine amount must be greater than 0.");
      return;
    }

    const newEntry: FineEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: fineName.trim(),
      regdNo: fineRegdNo.trim(),
      branch: fineBranch.trim(),
      year: fineYear.trim(),
      fineDate,
      componentName: fineComponentName.trim(),
      whatHappened: fineWhatHappened.trim(),
      amount: parsedAmount,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    const updatedEntries = [newEntry, ...fineEntries];
    setFineEntries(updatedEntries);
    localStorage.setItem(ADMIN_FINES_KEY, JSON.stringify(updatedEntries));

    setFineName("");
    setFineRegdNo("");
    setFineBranch("");
    setFineYear("");
    setFineDate("");
    setFineComponentName("");
    setFineWhatHappened("");
    setFineAmount("");
    setIsAddFineOpen(false);
    setFineSuccess("Fine entry added successfully.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_USER_KEY);
    setIsAuthenticated(false);
    setCurrentAdminUser(null);
    setLoginUsername("");
    setLoginPassword("");
    setCurrentView("requests");
  };

  const visibleRequests = useMemo(() => {
    const search = requestSearch.trim().toLowerCase();
    return requests.filter((request) => {
      if (request.status !== activeTab) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        request.studentName.toLowerCase().includes(search) ||
        request.componentName.toLowerCase().includes(search) ||
        request.clubRegNo.toLowerCase().includes(search) ||
        request.phoneNumber.toLowerCase().includes(search) ||
        request.emailAddress.toLowerCase().includes(search) ||
        request.purposeOfIssue.toLowerCase().includes(search)
      );
    });
  }, [activeTab, requestSearch, requests]);

  const visibleComponents = useMemo(() => {
    const search = inventorySearch.trim().toLowerCase();
    return components.filter(
      (component) =>
        component.name.toLowerCase().includes(search) || component.imageUrl.toLowerCase().includes(search),
    );
  }, [components, inventorySearch]);

  const visibleCoreMembers = useMemo(() => {
    const search = coreMemberSearch.trim().toLowerCase();
    return coreMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(search) ||
        member.branch.toLowerCase().includes(search) ||
        member.position.toLowerCase().includes(search) ||
        member.imageUrl.toLowerCase().includes(search),
    );
  }, [coreMemberSearch, coreMembers]);

  const visibleEvents = useMemo(() => {
    const search = eventSearch.trim().toLowerCase();
    return events.filter(
      (eventItem) =>
        eventItem.name.toLowerCase().includes(search) ||
        eventItem.date.toLowerCase().includes(search) ||
        eventItem.description.toLowerCase().includes(search) ||
        eventItem.imageUrl.toLowerCase().includes(search),
    );
  }, [eventSearch, events]);

  const visibleAchievements = useMemo(() => {
    const search = achievementSearch.trim().toLowerCase();
    return achievements.filter(
      (achievement) =>
        achievement.eventName.toLowerCase().includes(search) ||
        achievement.date.toLowerCase().includes(search) ||
        achievement.position.toLowerCase().includes(search) ||
        achievement.place.toLowerCase().includes(search) ||
        achievement.description.toLowerCase().includes(search),
    );
  }, [achievementSearch, achievements]);

  const visibleFines = useMemo(() => {
    const search = fineSearch.trim().toLowerCase();
    return fineEntries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(search) ||
        entry.regdNo.toLowerCase().includes(search) ||
        entry.branch.toLowerCase().includes(search) ||
        entry.componentName.toLowerCase().includes(search) ||
        entry.whatHappened.toLowerCase().includes(search) ||
        entry.year.toLowerCase().includes(search)
    );
  }, [fineSearch, fineEntries]);

  const visibleAdmins = useMemo(() => {
    const search = adminSearch.trim().toLowerCase();
    return createdAdminAccounts.filter(
      (admin) =>
        admin.username.toLowerCase().includes(search) ||
        admin.permissions.some(p => p.toLowerCase().includes(search))
    );
  }, [adminSearch, createdAdminAccounts]);

  const updateRequestStatus = async (requestId: string, status: RequestStatus) => {
    const handledAtIso = new Date().toISOString();
    const handledBy = currentAdminUser?.username ?? "";

    const { error } = await supabase
      .from("component_status")
      .update({ status, handled_by: handledBy, handled_at: handledAtIso })
      .eq("id", requestId);

    if (error) {
      alert(`Failed to update request status: ${error.message}`);
      return;
    }

    setRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
              handledBy,
              handledAt: formatDateTime(handledAtIso),
            }
          : request,
      ),
    );

    void loadAdminData();
  };

  const deleteComponent = async (componentId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the component "${name}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("components_list").delete().eq("id", componentId);

    if (error) {
      alert(`Failed to delete component: ${error.message}`);
      return;
    }

    setComponents((previous) => previous.filter((component) => component.id !== componentId));
    void loadAdminData();
  };

  const deleteCoreMember = async (memberId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the core member "${name}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("members").delete().eq("id", memberId);

    if (error) {
      alert(`Failed to delete member: ${error.message}`);
      return;
    }

    setCoreMembers((previous) => previous.filter((member) => member.id !== memberId));
    void loadAdminData();
  };

  const deleteEvent = async (eventId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the event "${name}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      alert(`Failed to delete event: ${error.message}`);
      return;
    }

    setEvents((previous) => previous.filter((eventItem) => eventItem.id !== eventId));
    void loadAdminData();
  };

  const deleteAchievement = async (achievementId: string, eventName: string) => {
    if (!window.confirm(`Are you sure you want to delete the achievement for "${eventName}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("achievements").delete().eq("id", achievementId);

    if (error) {
      alert(`Failed to delete achievement: ${error.message}`);
      return;
    }

    setAchievements((previous) => previous.filter((achievement) => achievement.id !== achievementId));
    void loadAdminData();
  };

  const addComponent = async () => {
    const cleanedName = newComponentName.trim();
    const cleanedUrl = newComponentImageUrl.trim();
    const parsedQuantity = Number(newComponentQuantity);

    if (!cleanedName || !cleanedUrl || Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
      return;
    }

    const { data, error } = await supabase
      .from("components_list")
      .insert([{ name: cleanedName, pic_link: cleanedUrl, total_stock: parsedQuantity }])
      .select("id, name, pic_link, total_stock")
      .single();

    if (error) {
      alert(`Failed to add component: ${error.message}`);
      return;
    }

    setComponents((previous) => [
      {
        id: data.id,
        name: data.name,
        imageUrl: data.pic_link ?? "",
        totalStock: Number(data.total_stock ?? parsedQuantity),
      },
      ...previous,
    ]);

    setNewComponentName("");
    setNewComponentImageUrl("");
    setNewComponentQuantity("1");
    setIsAddModalOpen(false);
    void loadAdminData();
  };

  const openEditComponent = (component: InventoryComponent) => {
    setEditingComponentId(component.id);
    setEditComponentName(component.name);
    setEditComponentImageUrl(component.imageUrl);
    setEditComponentQuantity(component.totalStock.toString());
    setIsEditComponentModalOpen(true);
  };

  const updateComponent = async () => {
    if (!editingComponentId) return;

    const cleanedName = editComponentName.trim();
    const cleanedUrl = editComponentImageUrl.trim();
    const parsedQuantity = Number(editComponentQuantity);

    if (!cleanedName || !cleanedUrl || Number.isNaN(parsedQuantity) || parsedQuantity < 1) {
      return;
    }

    const { error } = await supabase
      .from("components_list")
      .update({ name: cleanedName, pic_link: cleanedUrl, total_stock: parsedQuantity })
      .eq("id", editingComponentId);

    if (error) {
      alert(`Failed to update component: ${error.message}`);
      return;
    }

    setComponents((previous) =>
      previous.map((c) =>
        c.id === editingComponentId
          ? { ...c, name: cleanedName, imageUrl: cleanedUrl, totalStock: parsedQuantity }
          : c
      )
    );

    setIsEditComponentModalOpen(false);
    setEditingComponentId(null);
  };

  const addCoreMember = async () => {
    const name = coreMemberName.trim();
    const branch = coreMemberBranch.trim();
    const position = coreMemberPosition.trim();
    const imageUrl = coreMemberImageUrl.trim();

    if (!name || !position) {
      return;
    }

    const { data, error } = await supabase
      .from("members")
      .insert([
        {
          name,
          branch,
          position,
          pic_link: imageUrl.length > 0 ? imageUrl : null,
        },
      ])
      .select("id, name, branch, position, pic_link")
      .single();

    if (error) {
      alert(`Failed to add core member: ${error.message}`);
      return;
    }

    setCoreMembers((previous) => [
      {
        id: data.id,
        name: data.name,
        branch: data.branch,
        position: data.position,
        imageUrl: data.pic_link ?? "",
      },
      ...previous,
    ]);

    setCoreMemberName("");
    setCoreMemberBranch("");
    setCoreMemberPosition("");
    setCoreMemberImageUrl("");
    setIsAddCoreMemberOpen(false);
    void loadAdminData();
  };

  const addEvent = async () => {
    const name = eventName.trim();
    const date = eventDate.trim();
    const description = eventDescription.trim();
    const imageUrl = eventImageUrl.trim();

    if (!name || !date || !description || !imageUrl) {
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          event_name: name,
          event_date: date,
          description,
          pic_link: imageUrl,
        },
      ])
      .select("id, event_name, event_date, description, pic_link")
      .single();

    if (error) {
      alert(`Failed to add event: ${error.message}`);
      return;
    }

    setEvents((previous) => [
      {
        id: data.id,
        name: data.event_name,
        date: data.event_date ?? "",
        description: data.description ?? "",
        imageUrl: data.pic_link ?? "",
      },
      ...previous,
    ]);

    setEventName("");
    setEventDate("");
    setEventDescription("");
    setEventImageUrl("");
    setIsAddEventOpen(false);
    void loadAdminData();
  };

  const addAchievement = async () => {
    const eventNameValue = achievementEventName.trim();
    const date = achievementDate.trim();
    const position = achievementPosition.trim();
    const place = achievementPlace.trim();
    const description = achievementDescription.trim();

    if (!eventNameValue || !date || !position || !place || !description) {
      return;
    }

    const { data, error } = await supabase
      .from("achievements")
      .insert([
        {
          achievement_name: eventNameValue,
          event_date: date,
          position,
          event_place: place,
          description,
        },
      ])
      .select("id, achievement_name, event_date, position, event_place, description")
      .single();

    if (error) {
      alert(`Failed to add achievement: ${error.message}`);
      return;
    }

    setAchievements((previous) => [
      {
        id: data.id,
        eventName: data.achievement_name,
        date: data.event_date ?? "",
        position: data.position ?? "",
        place: data.event_place ?? "",
        description: data.description ?? "",
      },
      ...previous,
    ]);

    setAchievementEventName("");
    setAchievementDate("");
    setAchievementPosition("");
    setAchievementPlace("");
    setAchievementDescription("");
    setIsAddAchievementOpen(false);
    void loadAdminData();
  };

  const isProtectedBySuperAdmin = (request: IssueRequest) => {
    const handledBy = normalizeUsername(request.handledBy);
    const superAdminUsername = normalizeUsername(superAdminCredentials.username);

    return !isSuperAdmin && handledBy.length > 0 && handledBy === superAdminUsername;
  };

  const deleteRequest = async (request: IssueRequest) => {
    if (isProtectedBySuperAdmin(request)) {
      alert("Only super admin can delete this request.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the request for ${request.studentName}? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from("component_status").delete().eq("id", request.id);

    if (error) {
      alert(`Failed to delete request: ${error.message}`);
      return;
    }

    setRequests((previous) => previous.filter((item) => item.id !== request.id));
    void loadAdminData();
  };

  const renderActionButtons = (request: IssueRequest) => {
    if (request.status === "pending") {
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => updateRequestStatus(request.id, "approved")}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </button>
          <button
            type="button"
            onClick={() => updateRequestStatus(request.id, "rejected")}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </button>
        </div>
      );
    }

    if (request.status === "approved") {
      return (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => updateRequestStatus(request.id, "returned")}
            className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Mark as Returned
          </button>
        </div>
      );
    }

    const isLocked = isProtectedBySuperAdmin(request);

    return (
      <div className="flex flex-col items-end gap-2">
        <p className="text-right text-xs text-slate-400">Auto deleted after 6 months</p>
        <button
          type="button"
          onClick={() => deleteRequest(request)}
          disabled={isLocked}
          className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
            isLocked
              ? "cursor-not-allowed bg-slate-700 text-slate-400"
              : "bg-rose-600 text-white hover:bg-rose-500"
          }`}
          title={isLocked ? "Only super admin can delete this request" : "Delete request"}
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8 text-center">
              <img
                src="/assets/logo/Robostreaks Logo li.png"
                alt="Robostreaks logo"
                className="mx-auto mb-4 h-14 w-14 object-contain"
              />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Robostreaks</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Admin Login</h1>
              <p className="mt-2 text-sm text-slate-400">Enter the approved credentials to open the dashboard.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
                <input
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  placeholder="Username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>

              {loginError ? (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {loginError}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Login to Dashboard
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Credentials are required before the dashboard is shown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:28px_28px]" />
      <div className="relative flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 max-w-[85vw] overflow-y-auto border-r border-white/10 bg-slate-900/95 p-6 backdrop-blur-lg transition-transform duration-200 lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-10 flex items-center gap-3">
            <img
              src="/assets/logo/Robostreaks Logo li.png"
              alt="Robostreaks logo"
              className="h-10 w-10 rounded-xl bg-cyan-500/10 p-1.5 object-contain"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Robostreaks</p>
              <h1 className="text-lg font-semibold text-white">
                {isSuperAdmin ? "Super Admin Panel" : (currentAdminUser?.username ? currentAdminUser.username.charAt(0).toUpperCase() + currentAdminUser.username.slice(1) : "Admin")}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mb-6 inline-flex w-full items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500 hover:text-white"
          >
            Logout
          </button>

          <nav className="space-y-2">
            {canAccessView("requests") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("requests");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "requests"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Request Management
              </button>
            ) : null}
            {canAccessView("inventory") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("inventory");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "inventory"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Boxes className="h-4 w-4" />
                Inventory Control
              </button>
            ) : null}
            {canAccessView("coreMembers") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("coreMembers");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "coreMembers"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Users className="h-4 w-4" />
                Add Core Member
              </button>
            ) : null}
            {canAccessView("events") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("events");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "events"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                Events
              </button>
            ) : null}
            {canAccessView("achievements") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("achievements");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "achievements"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Trophy className="h-4 w-4" />
                Achievements
              </button>
            ) : null}
            {canAccessView("fines") ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("fines");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "fines"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Fine Management
              </button>
            ) : null}
            {isSuperAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("createAdmins");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "createAdmins"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Create Admins
              </button>
            ) : null}
            {isSuperAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentView("changeIdPassword");
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  currentView === "changeIdPassword"
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Change ID/Password
              </button>
            ) : null}
          </nav>
        </aside>

        {isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            aria-label="Close sidebar"
          />
        )}

        <section className="min-w-0 flex h-screen flex-1 flex-col overflow-hidden px-4 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pt-8">
          <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col min-w-0 overflow-hidden">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                {currentView === "requests"
                  ? "Issue Management"
                  : currentView === "inventory"
                    ? "Inventory Control"
                    : currentView === "coreMembers"
                      ? "Core Members"
                      : currentView === "events"
                        ? "Events"
                        : currentView === "achievements"
                          ? "Achievements"
                          : currentView === "fines"
                            ? "Fine Management"
                          : currentView === "createAdmins"
                            ? "Create Admins"
                            : "Change ID/Password"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {currentView === "requests"
                  ? "Track student requests and update issue status quickly."
                  : currentView === "inventory"
                    ? "Add or remove inventory items with minimal clicks."
                    : currentView === "coreMembers"
                      ? "Add and manage core member details for the club."
                      : currentView === "events"
                        ? "Create event records with date, details, and pictures."
                        : currentView === "achievements"
                          ? "Store competition results and recognition details."
                          : currentView === "fines"
                            ? "Create fine entries and review the fine list."
                          : currentView === "createAdmins"
                            ? "Create small admin accounts and assign module access."
                            : "Change super admin login ID and password."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg border border-white/10 bg-slate-900 p-2 text-slate-200 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {isSyncing && (
            <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
              Syncing data from Supabase...
            </div>
          )}

          {syncError && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              Supabase error: {syncError}
            </div>
          )}

          {currentView === "requests" && (
            <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {tabConfig.map((tab) => (
                    <button
                      type="button"
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        activeTab === tab.key
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={requestSearch}
                    onChange={(event) => setRequestSearch(event.target.value)}
                    placeholder="Search student, component, reg no, phone, email, purpose"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {visibleRequests.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/80 p-8 text-center text-slate-400 min-h-0">
                  No {activeTab} requests.
                </div>
              ) : (
                <div className="flex-1 overflow-auto rounded-xl border border-slate-800 min-h-0">
                  <table className="min-w-[1200px] divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Student</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Reg No</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Phone</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Email</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Component</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Qty</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Purpose</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Return Date</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Date</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Status</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Handled By</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Handled At</th>
                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                      {visibleRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-4 py-3 font-medium text-white">{request.studentName}</td>
                          <td className="px-4 py-3 text-slate-200">{request.clubRegNo || "-"}</td>
                          <td className="px-4 py-3 text-slate-200">{request.phoneNumber || "-"}</td>
                          <td className="px-4 py-3 text-slate-200">{request.emailAddress || "-"}</td>
                          <td className="px-4 py-3 text-slate-200">{request.componentName}</td>
                          <td className="px-4 py-3 text-slate-200">{request.quantity}</td>
                          <td className="px-4 py-3 text-slate-300">{request.purposeOfIssue || "-"}</td>
                          <td className="px-4 py-3 text-slate-300">{request.returnDate || "-"}</td>
                          <td className="px-4 py-3 text-slate-300">{request.date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${badgeClassByStatus[request.status]}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{request.handledBy || "-"}</td>
                          <td className="px-4 py-3 text-slate-300">{request.handledAt || "-"}</td>
                          <td className="px-4 py-3">{renderActionButtons(request)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {currentView === "inventory" && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Component</h3>
                    <p className="mt-1 text-sm text-slate-400">Add a new component to the inventory.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Add Component
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Inventory List</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={inventorySearch}
                      onChange={(event) => setInventorySearch(event.target.value)}
                      placeholder="Search components"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {visibleComponents.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">
                    No components found.
                  </div>
                ) : (
                  <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 min-h-0">
                  <table className="min-w-[760px] divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Component</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Picture Link</th>
                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                      {visibleComponents.map((component) => (
                        <tr key={component.id}>
                          <td className="px-4 py-3 font-medium text-white">{component.name}</td>
                          <td className="px-4 py-3 text-slate-300">
                            <a
                              href={component.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-cyan-300 underline decoration-cyan-500/50 underline-offset-2"
                            >
                              {component.imageUrl}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditComponent(component)}
                                className="rounded-md bg-blue-600/20 p-2 text-blue-400 transition hover:bg-blue-600 hover:text-white"
                                aria-label={`Edit ${component.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteComponent(component.id)}
                                className="rounded-md bg-rose-600/20 p-2 text-rose-400 transition hover:bg-rose-600 hover:text-white"
                                aria-label={`Delete ${component.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          )}

          {currentView === "fines" && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Fine Entry</h3>
                    <p className="mt-1 text-sm text-slate-400">Create a new fine and keep the list below visible.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddFineOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
                  >
                    <Plus className="h-4 w-4" /> Add Fine
                  </button>
                </div>
                {fineSuccess ? <p className="mt-3 text-sm text-emerald-300">{fineSuccess}</p> : null}
                {fineError ? <p className="mt-3 text-sm text-rose-300">{fineError}</p> : null}
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Fine List</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={fineSearch}
                      onChange={(event) => setFineSearch(event.target.value)}
                      placeholder="Search fine by name, reg no, branch..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
                {visibleFines.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">No fine entries found.</div>
                ) : (
                  <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 pb-2 min-h-0">
                    <table className="min-w-[1100px] divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                        <tr>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Name</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Regd No</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Branch</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Year</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Date</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Component</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">What Happened</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Rs Fined</th>
                          <th className="whitespace-nowrap px-4 py-3 text-center font-medium text-slate-300">Status</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                        {visibleFines.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-4 py-3 text-slate-100">{entry.name}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.regdNo}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.branch}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.year}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.fineDate}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.componentName}</td>
                            <td className="px-4 py-3 text-slate-300">{entry.whatHappened}</td>
                            <td className="px-4 py-3 text-right text-slate-100">{entry.amount}</td>
                            <td className="px-4 py-3 text-center">
                              {entry.status === 'paid' ? (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 mb-1">Paid</span>
                                  <span className="text-[9px] text-slate-400">By: {entry.handledBy}</span>
                                  <span className="text-[9px] text-slate-400 max-w-[100px] truncate" title={entry.paidRemarks}>Note: {entry.paidRemarks}</span>
                                </div>
                              ) : (
                                <span className="inline-flex rounded-full border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">Pending</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {entry.status !== 'paid' ? (
                                payingFineId === entry.id ? (
                                  <div className="flex flex-col items-end gap-2">
                                    <input 
                                      type="text" 
                                      placeholder="Remarks (e.g. Paid)" 
                                      className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
                                      value={payingRemarks}
                                      onChange={e => setPayingRemarks(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={() => setPayingFineId(null)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                                      <button onClick={() => handleMarkFinePaid(entry.id)} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold">Save</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-2">
                                    <button type="button" onClick={() => { setPayingFineId(entry.id); setPayingRemarks(""); }} className="rounded-md bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white">
                                      Mark Paid
                                    </button>
                                    {isSuperAdmin && (
                                      <button type="button" onClick={() => deleteFineEntry(entry.id, entry.name)} className="rounded-md bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-600 hover:text-white">
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                )
                              ) : (
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[11px] text-slate-500">{entry.paidAt ? new Date(entry.paidAt).toLocaleDateString() : ''}</span>
                                  {isSuperAdmin && (
                                    <button type="button" onClick={() => deleteFineEntry(entry.id, entry.name)} className="rounded-md bg-red-600/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-600 hover:text-white">
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "createAdmins" && isSuperAdmin && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Create Admin Account</h3>
                    <p className="mt-1 text-sm text-slate-400">Create small admins and select what modules they can use.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateAdminOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Create Admin
                  </button>
                </div>
                {createAdminSuccess ? (
                  <p className="mt-3 text-sm text-emerald-300">{createAdminSuccess}</p>
                ) : null}
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Created Admins</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={adminSearch}
                      onChange={(event) => setAdminSearch(event.target.value)}
                      placeholder="Search admins by username or permission"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
                {visibleAdmins.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">No small admins found.</div>
                ) : (
                  <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 min-h-0">
                    <table className="min-w-[820px] divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                        <tr>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Username</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Allowed Modules</th>
                          <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Status</th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                        {visibleAdmins.map((adminAccount) => (
                          <tr key={adminAccount.username}>
                            <td className="px-4 py-3 text-slate-100">{adminAccount.username}</td>
                            <td className="px-4 py-3 text-slate-300">{adminAccount.permissions.join(", ")}</td>
                            <td className="px-4 py-3 text-slate-300">
                              {adminAccount.isActive ? (
                                <span className="inline-flex rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full border border-rose-500/60 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">
                                  Removed
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => deleteAdminAccount(adminAccount.username)}
                                className="rounded-md bg-rose-600/20 p-2 text-rose-400 transition hover:bg-rose-600 hover:text-white"
                                aria-label={`Delete ${adminAccount.username}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "changeIdPassword" && isSuperAdmin && (
            <div className="flex-1 overflow-y-auto space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 min-h-0">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">Change Super Admin Username</h3>
                  <div className="mt-3 space-y-3">
                    <input
                      value={oldUsernameInput}
                      onChange={(event) => setOldUsernameInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Old Username"
                    />
                    <input
                      value={newUsernameInput}
                      onChange={(event) => setNewUsernameInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="New Username"
                    />
                    <input
                      value={confirmUsernameInput}
                      onChange={(event) => setConfirmUsernameInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Confirm Username"
                    />
                    <input
                      type="password"
                      value={usernameChangePasswordInput}
                      onChange={(event) => setUsernameChangePasswordInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={handleUsernameUpdate}
                      className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Save Username
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="text-base font-semibold text-white">Change Super Admin Password</h3>
                  <div className="mt-3 space-y-3">
                    <input
                      value={passwordChangeUsernameInput}
                      onChange={(event) => setPasswordChangeUsernameInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Username"
                    />
                    <input
                      type="password"
                      value={oldPasswordInput}
                      onChange={(event) => setOldPasswordInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Old Password"
                    />
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(event) => setNewPasswordInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="New Password"
                    />
                    <input
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(event) => setConfirmPasswordInput(event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={handlePasswordUpdate}
                      className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Save Password
                    </button>
                  </div>
                </div>
              </div>

              {usernameChangeError ? <p className="text-sm text-rose-300">{usernameChangeError}</p> : null}
              {usernameChangeSuccess ? <p className="text-sm text-emerald-300">{usernameChangeSuccess}</p> : null}
              {passwordChangeError ? <p className="text-sm text-rose-300">{passwordChangeError}</p> : null}
              {passwordChangeSuccess ? <p className="text-sm text-emerald-300">{passwordChangeSuccess}</p> : null}
            </div>
          )}

          {currentView === "coreMembers" && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Core Member</h3>
                    <p className="mt-1 text-sm text-slate-400">Add new core members and assign their roles.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddCoreMemberOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Add Member
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Core Members List</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={coreMemberSearch}
                      onChange={(event) => setCoreMemberSearch(event.target.value)}
                      placeholder="Search name, branch, position, or link"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

              {visibleCoreMembers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">
                  No core members found.
                </div>
              ) : (
                <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 min-h-0">
                  <table className="min-w-[900px] divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Name</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Branch</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Position</th>
                        <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-slate-300">Picture Link</th>
                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                      {visibleCoreMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                          <td className="px-4 py-3 text-slate-200">{member.branch || "-"}</td>
                          <td className="px-4 py-3 text-slate-200">{member.position}</td>
                          <td className="px-4 py-3 text-slate-300">
                            {member.imageUrl ? (
                              <a
                                href={member.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-cyan-300 underline decoration-cyan-500/50 underline-offset-2"
                              >
                                {member.imageUrl}
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteCoreMember(member.id, member.name)}
                              className="rounded-md bg-rose-600/20 p-2 text-rose-400 transition hover:bg-rose-600 hover:text-white"
                              aria-label={`Delete ${member.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          )}

          {currentView === "events" && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Event</h3>
                    <p className="mt-1 text-sm text-slate-400">Create a new event with date, details, and pictures.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddEventOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Add Event
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Events List</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={eventSearch}
                      onChange={(event) => setEventSearch(event.target.value)}
                      placeholder="Search event, date, details, or link"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

              {visibleEvents.length === 0 ? (
                <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">
                  No events found.
                </div>
              ) : (
                <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 min-h-0">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Event</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Details</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Picture Link</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                      {visibleEvents.map((eventItem) => (
                        <tr key={eventItem.id}>
                          <td className="px-4 py-3 font-medium text-white">{eventItem.name}</td>
                          <td className="px-4 py-3 text-slate-300">{eventItem.date}</td>
                          <td className="px-4 py-3 text-slate-300">{eventItem.description}</td>
                          <td className="px-4 py-3 text-slate-300">
                            <a
                              href={eventItem.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-cyan-300 underline decoration-cyan-500/50 underline-offset-2"
                            >
                              {eventItem.imageUrl}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteEvent(eventItem.id, eventItem.name)}
                              className="rounded-md bg-rose-600/20 p-2 text-rose-400 transition hover:bg-rose-600 hover:text-white"
                              aria-label={`Delete ${eventItem.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          )}

          {currentView === "achievements" && (
            <div className="flex-1 flex flex-col space-y-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl sm:p-6 overflow-hidden min-h-0">
              <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Achievement</h3>
                    <p className="mt-1 text-sm text-slate-400">Record new club achievements and awards.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAchievementOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" /> Add Achievement
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/50 p-4 min-h-0">
                <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">Achievements List</h3>
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={achievementSearch}
                      onChange={(event) => setAchievementSearch(event.target.value)}
                      placeholder="Search event, date, position, place, details"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

              {visibleAchievements.length === 0 ? (
                <div className="flex-1 flex items-center justify-center mt-3 text-sm text-slate-400">
                  No achievements found.
                </div>
              ) : (
                <div className="flex-1 mt-4 overflow-auto rounded-lg border border-slate-800 min-h-0">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-900 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Event</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Position</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Place</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-300">Description</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-300">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                      {visibleAchievements.map((achievement) => (
                        <tr key={achievement.id}>
                          <td className="px-4 py-3 font-medium text-white">{achievement.eventName}</td>
                          <td className="px-4 py-3 text-slate-300">{achievement.date}</td>
                          <td className="px-4 py-3 text-slate-200">{achievement.position}</td>
                          <td className="px-4 py-3 text-slate-200">{achievement.place}</td>
                          <td className="px-4 py-3 text-slate-300">{achievement.description}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteAchievement(achievement.id, achievement.eventName)}
                              className="rounded-md bg-rose-600/20 p-2 text-rose-400 transition hover:bg-rose-600 hover:text-white"
                              aria-label={`Delete ${achievement.eventName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          )}
      </div>
        </section>

      <AddComponentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        name={newComponentName}
        imageUrl={newComponentImageUrl}
        quantity={newComponentQuantity}
        onNameChange={setNewComponentName}
        onImageUrlChange={setNewComponentImageUrl}
        onQuantityChange={setNewComponentQuantity}
        onSubmit={addComponent}
      />
      
      <AddCoreMemberModal
        isOpen={isAddCoreMemberOpen}
        onClose={() => setIsAddCoreMemberOpen(false)}
        name={coreMemberName}
        branch={coreMemberBranch}
        position={coreMemberPosition}
        imageUrl={coreMemberImageUrl}
        onNameChange={setCoreMemberName}
        onBranchChange={setCoreMemberBranch}
        onPositionChange={setCoreMemberPosition}
        onImageUrlChange={setCoreMemberImageUrl}
        onSubmit={addCoreMember}
      />

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        name={eventName}
        date={eventDate}
        description={eventDescription}
        imageUrl={eventImageUrl}
        onNameChange={setEventName}
        onDateChange={setEventDate}
        onDescriptionChange={setEventDescription}
        onImageUrlChange={setEventImageUrl}
        onSubmit={addEvent}
      />

      <AddAchievementModal
        isOpen={isAddAchievementOpen}
        onClose={() => setIsAddAchievementOpen(false)}
        eventName={achievementEventName}
        date={achievementDate}
        position={achievementPosition}
        place={achievementPlace}
        description={achievementDescription}
        onEventNameChange={setAchievementEventName}
        onDateChange={setAchievementDate}
        onPositionChange={setAchievementPosition}
        onPlaceChange={setAchievementPlace}
        onDescriptionChange={setAchievementDescription}
        onSubmit={addAchievement}
      />

      <CreateAdminModal
        isOpen={isCreateAdminOpen}
        onClose={() => setIsCreateAdminOpen(false)}
        username={newAdminUsername}
        confirmUsername={confirmAdminUsername}
        password={newAdminPassword}
        confirmPassword={confirmAdminPassword}
        permissions={newAdminPermissions}
        error={createAdminError}
        onUsernameChange={setNewAdminUsername}
        onConfirmUsernameChange={setConfirmAdminUsername}
        onPasswordChange={setNewAdminPassword}
        onConfirmPasswordChange={setConfirmAdminPassword}
        onTogglePermission={togglePermissionSelection}
        onSubmit={createAdminAccount}
      />

      <FineEntryModal
        isOpen={isAddFineOpen}
        onClose={() => setIsAddFineOpen(false)}
        name={fineName}
        regdNo={fineRegdNo}
        branch={fineBranch}
        year={fineYear}
        fineDate={fineDate}
        componentName={fineComponentName}
        whatHappened={fineWhatHappened}
        amount={fineAmount}
        error={fineError}
        success={fineSuccess}
        onNameChange={setFineName}
        onRegdNoChange={setFineRegdNo}
        onBranchChange={setFineBranch}
        onYearChange={setFineYear}
        onFineDateChange={setFineDate}
        onComponentNameChange={setFineComponentName}
        onWhatHappenedChange={setFineWhatHappened}
        onAmountChange={setFineAmount}
        onSubmit={addFineEntry}
      />
      
      <ConfirmDeleteModal
        isOpen={fineToDelete !== null}
        onClose={() => setFineToDelete(null)}
        onConfirm={confirmDeleteFine}
        message={`Are you sure you want to delete the fine entry for ${fineToDelete?.name}? This action cannot be undone.`}
      />

      <EditComponentModal
        isOpen={isEditComponentModalOpen}
        onClose={() => setIsEditComponentModalOpen(false)}
        name={editComponentName}
        imageUrl={editComponentImageUrl}
        quantity={editComponentQuantity}
        onNameChange={setEditComponentName}
        onImageUrlChange={setEditComponentImageUrl}
        onQuantityChange={setEditComponentQuantity}
        onSubmit={updateComponent}
      />
    </div>
    </div>
  );
};

export default AdminPage;