import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Vector3, Fog,  } from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import bold from "../assets/font/Modak_Regular.json"
import {OrbitControls, Center, Sparkles } from "@react-three/drei";
import { useSpring, animated, easings } from '@react-spring/three'
import {useDispatch, useSelector} from 'react-redux'
import {addSecret, selectSecrets} from "../state/secretSlice";

const VALID_CHARACTERS = new Set([' ', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', "'", ';', '[', ']', '=', '-', '0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '`', '~', '<', '>', '?', ':', '"', '{', '}', '|', '+', '_', ')', '(', '*', '&', '^', '%', '$', '#', '@', '!', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'])

const SecretsCanvas = () => {

    const secrets = Array(...Object.keys(useSelector(selectSecrets)))

    const [submitted, _setSubmitted] = useState(false)
    const submittedRef = useRef(submitted)
    const setSubmitted = data => {
        submittedRef.current = data
        _setSubmitted(data)
    }

    const [string, _setString] = useState("") // Shoutout ->  https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
    const stringRef = useRef(string)
    const setString = data => {
        stringRef.current = data
        _setString(data)
    }

    const dispatch = useDispatch()

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(!submittedRef.current){
                if(e.key === "Backspace"){
                    setString(stringRef.current.slice(0, -1))
                } else if(e.key === "Enter") {
                    setSubmitted(true)
                    setTimeout(() => {
                        dispatch(addSecret(stringRef.current))
                        setString("")
                        setSubmitted(false)
                    }, 2000)
                } else if(VALID_CHARACTERS.has(e.key)){
                    setString(stringRef.current + e.key)
                }
            }
        })
    }, [])

    return (
        <Canvas camera={{position: [0,10,50]}}>
            <Scene />
            <OrbitControls />
            <pointLight position={[20,10,20]} intensity={10} />
            <ambientLight />
            <InputBar input={stringRef.current} submitted={submitted} />
            <BubbleStorm secrets={secrets}/>

        </Canvas>
    )
}

const getRandomPosition = (bounds) => {
    return new Vector3(bounds.map(b => b[0] + ((b[1] - b[0]) * Math.random())))
}

const BubbleStorm = ({secrets}) => {

    const bounds = [[-50,50],[-50,50],[-50,50]]

    const sparkleRef = useRef()
    const sizes = React.useMemo(() => {
        return new Float32Array(Array.from({ length: 5000 }, () => Math.random() * 50))
    })

    useFrame(() => {
        sparkleRef.current.rotation.x += Math.random() * .001
    })

    return (
        <group>
            <Sparkles position={[0,0,10]} ref={sparkleRef} count={5000} color={"#fdbe66"} scale={80} size={sizes} speed={1} noise={1}/>
            {secrets.map(secret =>
                <StormWord key={secret} string={secret} position={getRandomPosition(bounds)} />
            )}
        </group>
    )
}

const updateMoveVector = (currentMoveVector) => {
    const directionVector = new Vector3().randomDirection().multiplyScalar(.011)

    return currentMoveVector.add(directionVector)
}

const StormWord = ({string}, props) => {

    const MAX_POSITION = 50

    const ref = useRef()
    const [moveVector, setMoveVector] = useState(new Vector3().randomDirection())

    useFrame(() => {
        ref.current.position.add(moveVector)

        for(const index of Array(3).keys()){
            if(Math.abs(ref.current.position.getComponent(index)) > MAX_POSITION){
                moveVector.setComponent(index, ref.current.position.getComponent(index)*-.0001 + moveVector.getComponent(index))
            }
        }

        setMoveVector(updateMoveVector(moveVector).normalize())
    })

    return(
        <group ref={ref} {...props}>
            <BubbleWord string={string}/>
        </group>
    )
}

const BubbleWord = ({ children, vAlign = 'center', hAlign = 'center', size = 1.5, color = '#000000', string, scale, ...props }) => {

    extend({ TextGeometry })

    const font = new FontLoader().parse(bold)

    return (
        <animated.mesh scale={.1*size} {...props}>
            <textGeometry
                args={[string, { font, size: 40, height: 20,
                    curveSegments: 2, bevelEnabled: true, bevelThickness: 3,
                    bevelSize: 1, bevelOffset: -1, bevelSegments: 3}
                ]}
            />
            <meshNormalMaterial/>
        </animated.mesh>
    )
}

const InputBar = ({input, submitted}) => {

    const { z } = useSpring({
        z: submitted ? -1000 : 0,
        config: {
            duration: 2000,
            easing: easings.easeInExpo,
        },
        immediate: !submitted
    })

    return(
        <animated.group position-z={z}>
            <Center>
                <BubbleWord string={input} />
            </Center>
        </animated.group>
    )
}

const Scene = ({newMaterialOpt}) => {
    const {
        scene
    } = useThree();

    useEffect(() => {
        scene.fog = new Fog(0xf1f1f1, 0, 100);
    }, [])

    return (<> </>)
}

export { SecretsCanvas }