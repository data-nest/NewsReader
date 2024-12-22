import { db, auth } from "@/configs/firebase";
import axios from "axios";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { child, get, ref, set } from "firebase/database";
import React, { createContext, useEffect, useState } from 'react'

export const NewsProvider = createContext(null)

const NewsContext = ({ children }) => {

    const api = axios.create({
        baseURL:"https://api.dhinakaattru.com"
    })

    const refLoc = "/news_approved/" 
    const [news, setNews] = useState([])
    const [user, setUser] = useState({})
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        getNews()
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log(currentUser)
                setUser(currentUser)
                getRole(currentUser?.uid)
            } else {
                setUser(null)
            }
        });
    },[user])

    async function getNews(){
        setLoading(true)
        const data = await get(child(ref(db),refLoc))
        if(data.exists()){
            let blogsList = []
            if(!Array.isArray(data.val())){
                blogsList = Object.values(data.val()).map((item)=> item!==undefined || item!==null && item)
            }else{
                blogsList = data.val()
            }
            blogsList = blogsList?.filter(item => item !== undefined).sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setNews(blogsList)
        }else{
            console.log("No data found")
            setNews([])
        }
        setLoading(false)
    }

    async function getOneNews(id){
        const data = await get(child(ref(db),`${refLoc}${id}/`))
        if(data.exists()){
            let lists = data.val()
            console.log(lists)
            return lists
        }else{
            console.log("No data found")
            return null
        }
    }
    
    async function Login(email, password) {
        try {
            const usr = await signInWithEmailAndPassword(auth, email, password)
            console.log(usr)
            setUser(usr)
        } catch (error) {
            console.log(error)
        }
    }

    async function getRole(uid){
        try {
            const body = {
                uid: uid
            }
            const { data } = await api.post(`/get_user_roles`,body)
            console.log(data)
            setRole(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <NewsProvider.Provider value={{ news, getOneNews, loading, Login, user, getRole, getNews }}>
            { children }
        </NewsProvider.Provider>
    )
}

export default NewsContext