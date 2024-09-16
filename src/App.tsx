import { ConfigProvider, notification } from "antd"
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"
import { createContext, useEffect, useState } from "react";
import { GlobalContext, NotificationType } from "./models/global.model";
import Home from "./page/Home";
import Register from "./page/Register";
import UsersList from "./page/UsersList";
import AdminDash from "./page/AdminDash";
import UsersAdd from "./page/UsersAdd";
import GroupsList from "./page/GroupsList";
import GroupsAdd from "./page/GroupsAdd";
import UsersEdit from "./page/UsersEdit";
import ContentWrapper from "./templates/ContentWrapper";
import AuthContainer from "./templates/AuthContainer";
import ApiClient from "./services/api.service";
import { GitlabProject, IpaGroup } from "./models/api.model";
import GroupsEdit from "./page/GroupsEdit";

export const Context = createContext<GlobalContext>({} as GlobalContext);

function AdminRoutes() {
  return <AuthContainer>
    <ContentWrapper>
      <Outlet />
    </ContentWrapper>
  </AuthContainer>
}

const apiClient = new ApiClient();

function App() {
  const [api, contextHolder] = notification.useNotification();
  const [gitlabProjects, setGitlabProjects] = useState<GitlabProject[]>([])
  const [ipaGroups, setIpaGroups] = useState<IpaGroup[]>([])
  const [jenkinsRoles, setJenkinsRoles] = useState<GitlabProject[]>([])
  const [rangerPolicies, setRangerPolicies] = useState<GitlabProject[]>([])

  useEffect(() => {
    console.log(`Iniciando o ${import.meta.env.VITE_APP_NAME} versão ${import.meta.env.VITE_APP_VERSION}`)
  })

  const openNotification = (message: string, description: string, type: NotificationType) => {
    api[type]({
      message,
      description
    });
  };

  const loadOptions = async () => {
    const response = await Promise.all([
      apiClient.getGitlabProjects(),
      apiClient.getIpaGroups(),
      apiClient.getJenkinsRoles(),
      apiClient.getRangerPolicies(),
    ])
    setGitlabProjects(response[0]);
    setIpaGroups(response[1]);
    setJenkinsRoles(response[2]);
    setRangerPolicies(response[3]);
  }


  useEffect(() => {
    loadOptions()
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#355066',
        },
      }}
    >
      {contextHolder}
      <Context.Provider value={{
        openNotification,
        gitlabProjects,
        ipaGroups,
        jenkinsRoles,
        rangerPolicies
      }}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />

            <Route path="/admin" element={<AdminRoutes />}>
              <Route path="" element={<AdminDash />} />
              <Route path="users/list" element={<UsersList />} />
              <Route path="users/new" element={<UsersAdd />} />
              <Route path="users/edit/:username" element={<UsersEdit />} />
              <Route path="groups/list" element={<GroupsList />} />
              <Route path="groups/new" element={<GroupsAdd />} />
              <Route path="groups/edit/:id" element={<GroupsEdit />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Context.Provider>
    </ConfigProvider>
  )
}

export default App
