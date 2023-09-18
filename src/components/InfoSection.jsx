import { useSession } from "../context/AuthProvider";

export default function InfoSection() {
    const {lid,ready} = useSession();
    if (!ready) return <div>loading...</div>
    else return <div dangerouslySetInnerHTML={{__html: lid.infobox[0].waarde}}></div>
}