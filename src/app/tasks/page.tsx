import TasksPage from "@/components/tasks/TasksPage";
import { Metadata } from "next";
import { generateMetadata } from "@/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "ساعتين جد - المهام",
  description: "إدارة المهام اليومية بكفاءة. نظم مهامك، تتبع تقدمك، وحقق أهدافك",
  path: "/tasks",
});
const page = () => {
  return <TasksPage />;
};

export default page;
