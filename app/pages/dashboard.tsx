import CreateLink from "@/components/CreateLink";
import { RecentLinks } from "@/components/dashboard/recent-links";
import { useLinks } from "@/lib/hooks/use-links"

export default function Dashboard() {
    const { links } = useLinks()
    
    return (
        <div className="p-6">
            <h1>Dashboard</h1>
            <CreateLink />
            <RecentLinks links={links} />
        </div>
    );
} 