import { BillboardClient } from "./billboards/components/client";

interface DashboardPageProps {
  // Define your prop types here
  // For example:
  // title: string;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  // You can access the props here, for example:
  // const { title } = props;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
      Dashboard!

      </div>
    </div>
  );
};

export default DashboardPage;
