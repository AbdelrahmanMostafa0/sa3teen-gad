import RenderSettings from "@/components/settings/RenderSettings";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import { Metadata } from "next";
import { generateMetadata } from "@/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "ساعتين جد - الإعدادات",
  description: "تخصيص إعدادات التطبيق. اضبط مؤقت البومودورو، أوقات الصلاة، والتذكيرات حسب احتياجاتك",
  path: "/settings",
  noIndex: true, // Settings pages typically shouldn't be indexed
});
const page = () => {
  return <UserProfileSettings />;
};

export default page;
