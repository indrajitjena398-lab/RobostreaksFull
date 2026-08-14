import { useState } from 'react';
import { Search, ShieldAlert, CheckCircle } from 'lucide-react';

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

const CheckFinePage = () => {
  const [regNo, setRegNo] = useState('');
  const [hasChecked, setHasChecked] = useState(false);
  const [userFines, setUserFines] = useState<FineEntry[]>([]);

  const handleCheckFine = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regNo.trim()) return;

    try {
      const rawFines = localStorage.getItem('robostreaks-fine-entries');
      const allFines: FineEntry[] = rawFines ? JSON.parse(rawFines) : [];

      const foundFines = allFines.filter(
        (fine) => fine.regdNo.toLowerCase() === regNo.trim().toLowerCase() && fine.status !== 'paid'
      );

      setUserFines(foundFines);
      setHasChecked(true);
    } catch (error) {
      console.error('Error reading fines', error);
      setUserFines([]);
      setHasChecked(true);
    }
  };

  return (
    <div className="pt-32 min-h-screen bg-[#0a0f18] text-white pb-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-500 bg-clip-text text-transparent">
            Fine Management
          </h1>
          <p className="text-gray-400">Check if you have any pending fines by entering your registration number.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Left Side: Search Box */}
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6">Search Fine Record</h2>
              <form onSubmit={handleCheckFine} className="flex flex-col gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Enter Registration No."
                    className="w-full bg-[#0a0f18] border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 transition"
                    value={regNo}
                    onChange={(e) => {
                      setRegNo(e.target.value);
                      setHasChecked(false); // Reset search state when typing
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 px-8 rounded-lg transition"
                >
                  Check Fines
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="w-full lg:w-1/2 flex-1 min-w-0">
            {hasChecked && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                {userFines.length > 0 ? (
                  <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[75vh]">
                    {/* Common Student Info Header */}
                    <div className="shrink-0 mb-6 border-b border-gray-700 pb-5">
                      <h2 className="text-2xl font-bold text-white mb-3">{userFines[0].name}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                        <p><span className="text-gray-500 font-medium">Regd No:</span> {userFines[0].regdNo}</p>
                        <p><span className="text-gray-500 font-medium">Branch:</span> {userFines[0].branch}</p>
                        <p><span className="text-gray-500 font-medium">Year:</span> {userFines[0].year}</p>
                      </div>
                    </div>

                    {/* Fines List Area */}
                    <div className="flex items-center justify-between text-rose-400 mb-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="font-bold text-lg">Pending Fines ({userFines.length})</span>
                      </div>
                      <span className="font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                        Total: ₹{userFines.reduce((sum, fine) => sum + fine.amount, 0)}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0 custom-scrollbar">
                      {userFines.map((fine) => (
                        <div key={fine.id} className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 transition hover:bg-rose-950/30">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1 truncate">{fine.componentName}</h3>
                            <p className="text-rose-200/70 text-xs mb-3">Issue Date: {fine.fineDate}</p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              <span className="font-semibold text-rose-300">Reason:</span> {fine.whatHappened}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-start sm:items-center">
                            <div className="bg-rose-600 text-white font-bold px-4 py-2 rounded-lg text-lg text-center min-w-[80px] shadow-lg shadow-rose-900/20">
                              ₹{fine.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111827] border border-emerald-900/30 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                      <CheckCircle className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-emerald-400 mb-3">All Clear!</h2>
                    <p className="text-gray-400 text-lg">There is no fine on you by Robostreaks.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckFinePage;