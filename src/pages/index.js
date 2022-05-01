import React, {Suspense} from "react"
import {Button, Box, Flex, Image, Input} from "theme-ui"
import {useState} from "react";
import { signInWithGoogle } from "../assets/js/util";
import { SecretsCanvas } from "../components/secretBox";
import {useSelector} from 'react-redux'
import {selectUID} from "../state/secretSlice";
import SEO from "../components/seo"
import google from "../assets/images/google.svg"

const  LoginButton = () => {

    const uid = useSelector(selectUID);

    if(uid){return null} // Don't need a login if you are already in

    return (
        <Button
            sx={{position: 'absolute', m: 2, px: 2, py: 1, top: 0, right: 0, zIndex:2, color: "#3a3a3a", backgroundColor: "#fd9c8552"}}
            onClick={signInWithGoogle}
        >
            <Flex>
                <Box>
                    Login
                </Box>
                <Flex>
                    <Image sx={{height: "auto", my: "auto", pl: 2}} src={google}/>
                </Flex>
            </Flex>
        </Button>
    )
}

const KeyboardButton = () => {


    if(!navigator.userAgentData.mobile){
        return null
    }

    return (
        <Input
            sx={{
                position: "absolute",
                top: "25%",
                height: "50vh",
                bg: "transparent",
                border: 0,
                zIndex: 2,
                outline: "none",
                outlineWidth: 0,
                color: "transparent"
            }}
        />
    )
}

const IndexPage = () => {

    const [showLogin, setShowLogin] = useState(false)

    return (
        <Box sx={{height: "100vh", width: "100vw"}} as={"main"}>
            <SEO title={"Brainstorm"}/>
            <LoginButton/>
            <KeyboardButton />
            <Suspense>
                <SecretsCanvas />
            </Suspense>
        </Box>
    )
}

export default IndexPage
