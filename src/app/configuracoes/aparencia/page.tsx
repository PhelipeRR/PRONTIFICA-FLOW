import { SettingsSubpage } from "../../../components/settings-subpage";
import { OperationalSettingsForm } from "../../../components/operational-settings-form";
export default function Page(){return <SettingsSubpage title="Aparência e preferências" description="Preferências da experiência administrativa."><OperationalSettingsForm fields={[{key:"appearance_density",label:"Densidade das tabelas",description:"Defina o espaçamento padrão das listagens."},{key:"appearance_language",label:"Idioma",description:"Idioma principal da operação."}]}/></SettingsSubpage>}
