import { useEffect, useState } from "react";
import type { Link } from "@/types/database"

export default function LinksSection() {
    const [links, setLinks] = useState<Link[]>([]);

    const fetchLinks = async () => {
        const response = await fetch("/api/links");
        const data = await response.json() as { links: Link[] };
        setLinks(data.links);
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    return (
        <div>
            <h2>Your Links</h2>
            <ul>
                {links.map((link: Link) => (
                    <li key={link.id}>
                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
} 