import React, {Suspense} from "react"
import {Button, Box} from "theme-ui"
import {useState} from "react";
import { signInWithGoogle } from "../assets/js/util";
import { SecretsCanvas } from "../components/secretBox";
import {useSelector} from 'react-redux'
import {selectUID} from "../state/secretSlice";

const  LoginButton = () => {

    const uid = useSelector(selectUID);

    if(uid){return null} // Don't need a login if you are already in

    return (
        <Button
            sx={{position: 'absolute', m: 2, top: 0, right: 0, zIndex:2, color: "#3a3a3a", backgroundColor: "#fd9c85"}}
            onClick={signInWithGoogle}
        >
            Login With Google
        </Button>
    )
}

const IndexPage = () => {

    const [showLogin, setShowLogin] = useState(false)

    return (
        <Box sx={{height: "100vh", width: "100vw"}} as={"main"}>
            <LoginButton/>
            <Suspense>
                <SecretsCanvas />
            </Suspense>
        </Box>
    )
}

export default IndexPage
