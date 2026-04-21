import ProfilePage from "@/components/pages/profile/profilePage";

type Props = {
  params: {
    userName: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const { userName } = await params;

  return <ProfilePage userName={userName} />;
};

export default UserProfile;
