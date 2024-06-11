import React from 'react';
import Myprofile from './Components/myprofile/Myprofile';
import Page from './Components/page/page';
import Datathoitiet from './Components/datathoitiet/Datathoitiet';
import Lichsudenquat from './Components/lichsudenquat/Lichsudenquat';
const routes = [
    {
        id: 1,
        path: "/",
        main: () => <Page />
    },
    {
        id: 2,
        path: "/Myprofile",
        main: () => <Myprofile />
    },
    {
        id: 3,
        path: "/Datathoitiet",
        main: () => <Datathoitiet />
    },
    ,
    {
        id: 4,
        path: "/Lichsudenquat",
        main: () => <Lichsudenquat />
    },
]

export default routes;