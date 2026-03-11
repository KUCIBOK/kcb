import { useEffect, useState } from "react";
import { SubscriptionsList } from "./SubscriptionsList";
import { getAllSubscriptions } from "../../api/useSubscriptions";


export function SubscriptionTab(){
    const [state, setState] = useState({
        subscriptions : [],
        set : [],
        loading : true
    })
    useEffect(() => {
        const getSusbscriptions = async function(){
            try {
                const subscriptions = await getAllSubscriptions()
                if(subscriptions?.length > 0){
                    setState(prev => ({
                        subscriptions : subscriptions,
                        set : subscriptions?.slice(0, 5),
                        loading : false
                    }))
                }
            } catch (error) {
                setState(prev => ({...prev, loading : false}))
            }
        }
        getSusbscriptions()
    }, [])
    return (
        <>
            <div className="my-4">
                <SubscriptionsList subscriptions={state?.set}/>
            </div>
        
        </>
    )
}