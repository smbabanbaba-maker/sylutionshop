import {AlertCircle,AlertTriangle,CheckCircle2,Info, type LucideIcon} from "lucide-react";
export type StatusTone="success"|"error"|"warning"|"info"|"neutral";
const icons:Record<StatusTone,LucideIcon>={
 success:CheckCircle2,error:AlertCircle,warning:AlertTriangle,info:Info,neutral:Info
};
/** Only use success when the described action really happened. A local draft
 * is informative, not verification or a completed buyer–seller transaction.
 */
export function StatusNotice({tone,children,className="",role}:{tone:StatusTone;children:React.ReactNode;className?:string;role?:"status"|"alert"}){
 const Icon=icons[tone];
 return <div role={role||(tone==="error"?"alert":"status")} data-tone={tone} className={"sy-semantic-notice "+className}><Icon size={17} aria-hidden="true"/><span>{children}</span></div>;
}
export function StatusBadge({tone,children}:{tone:StatusTone;children:React.ReactNode}){
 const Icon=icons[tone];
 return <span className="sy-semantic-badge" data-tone={tone}><Icon size={13} aria-hidden="true"/>{children}</span>;
}
