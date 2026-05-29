import MemberList from "@/components/features/team/member-list";
import InviteMember from "@/components/features/team/invite-member";
import ActivityFeed from "@/components/features/team/activity-feed";

export default function TeamPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your organization's team members, roles, and track collaboration activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MemberList />
        </div>
        <div className="space-y-8">
          <InviteMember />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
