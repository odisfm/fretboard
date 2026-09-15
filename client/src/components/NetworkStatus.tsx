import {useUserData} from "../contexts/userData/useUserData.tsx";
import {TbNetwork, TbNetworkOff} from "react-icons/tb";
import Spinner from "./generic/Spinner.tsx";
import Tooltip from "./generic/Tooltip.tsx";


export function NetworkStatus() {
    const userDataContext = useUserData()
    const iconStyles = ""
    let containerStyles = ""
    if (!userDataContext.connectionStatus) {
        containerStyles += `bg-red-800`
    }
    return (
        <div className={`flex items-center justify-center rounded-md min-w-8 ${containerStyles}`}>
            <div className={iconStyles}>
                {
                    userDataContext.waitOnServer ?
                        <Spinner classes={iconStyles}/>
                        :
                        <>
                            {userDataContext.connectionStatus ?
                                <TbNetwork className={iconStyles}/>
                                :
                                <div className={`flex gap-2 px-2`}>
                                    <TbNetworkOff className={iconStyles}/>
                                    <Tooltip text={"No connection to server"} />
                                </div>
                            }
                        </>
                }
            </div>
        </div>
    )
}