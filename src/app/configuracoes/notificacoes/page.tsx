import { SettingsSubpage } from "../../../components/settings-subpage";
import { OperationalSettingsForm } from "../../../components/operational-settings-form";
export default function Page(){return <SettingsSubpage title="Notificações" description="Parâmetros dos alertas da operação."><OperationalSettingsForm fields={[{key:"notifications_enabled",label:"Alertas internos",description:"Ativar alertas dentro do sistema.",type:"checkbox"},{key:"notification_email",label:"E-mail de notificação",description:"Endereço que receberá alertas operacionais."}]}/></SettingsSubpage>}
