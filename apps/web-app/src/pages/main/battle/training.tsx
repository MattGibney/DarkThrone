import DarkThroneClient from '@darkthrone/client-library';
import SubNavigation from '../../../components/layout/subNavigation';

interface TrainingScreenProps {
  client: DarkThroneClient;
}
export default function TrainingScreen(props: TrainingScreenProps) {
  return (
    <main>
      <SubNavigation />

      {/* <div className="table border-collapse table-auto w-full">
        <div className="table-header-group">
          <div className="table-row">
            <div className="table-cell border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Song</div>
            <div className="table-cell border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Artist</div>
            <div className="table-cell border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Year</div>
          </div>
        </div>
        <div className="table-row-group bg-white dark:bg-slate-800">
          <div className="table-row">
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">The Sliding Mr. Bones (Next Stop, Pottersville)</div>
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">Malcolm Lockyer</div>
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">1961</div>
          </div>
          <div className="table-row">
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">Witchy Woman</div>
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">The Eagles</div>
            <div className="table-cell border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">1972</div>
          </div>
          <div className="table-row">
            <div className="table-cell border-b border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">Shining Star</div>
            <div className="table-cell border-b border-slate-200 dark:border-slate-600 p-4 text-slate-500 dark:text-slate-400">Earth, Wind, and Fire</div>
            <div className="table-cell border-b border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400">1975</div>
          </div>
        </div>
      </div> */}
    </main>
  );
}
