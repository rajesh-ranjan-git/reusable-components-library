import AdminWrapper from "@/components/admin/adminWrapper";
import AdminPage from "@/components/pages/admin/adminPage";
import { AdminProps } from "@/types/propTypes";

const Admin = async ({ params }: AdminProps) => {
  const { type } = await params;

  return (
    <AdminWrapper>
      <AdminPage type={type} />
    </AdminWrapper>
  );
};

export default Admin;
