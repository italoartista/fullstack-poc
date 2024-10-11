import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/auth-context";


import { ChatbotFlowDashboardComponent } from "@/components/chatbot-flow-dashboard"


export default function ChatBotPage() {  

  useEffect(() => { 
    
    const { user } = useContext(AuthContext);                                           
    const router = userRouter();  


    useEffect(() => {
    if(!user) {
      router.push('/login');
    }
    
    }, [user, router]);                                       
  })
  
  return (
    <div className="container mx-auto py-10">
      <ChatbotFlowDashboardComponent />
    </div>                            
  )
}