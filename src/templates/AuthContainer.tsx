import { AuthenticationService } from "../services/authentication.service"
import { useEffect, useState } from "react"

type authContainerProps = {
  children: any
}

const authService = new AuthenticationService();

export default function AuthContainer({ children }: authContainerProps) {
  const [isLoading, setIsLoading] = useState<boolean>();

  const initAuthService = async () => {
    setIsLoading(true)
    await authService.init()
    await new Promise(resolve => setTimeout(resolve, 250))
    setIsLoading(false)
  }

  useEffect(() => {
    initAuthService();
  }, [])

  if (isLoading)
    return <h1>Iniciando, aguarde...</h1>

  return children
}
