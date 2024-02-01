import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios";

const InfiniteScroll = () => {

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [hasMoreData, setHasMoreData] = useState(true);//vai identificar na API se tem mais paguina para ler

    const fetchPosts = async () => {
        //fazer a chamada inicial
        if(isLoading) return;// retorna se estiver carregando ainda
        setIsLoading(true)

        try {
            const response = await axios.get(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
            );

                if(response.data.length > 0) {
                    setPosts((prevPosts) => [...prevPosts, ...response.data]) //incremetando os posts com base no estado atual
                } else {
                    setHasMoreData(false);
                }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const handleScroll = () => { //função para o scroll
        if(window.innerHeight + window.scrollY >= 
            document.documentElement. scrollHeight - 100 && 
            !isLoading && hasMoreData
            ) {
            setPage((prevPage) => prevPage + 1);
        } 
    }

    useEffect(() => {
//aqui n pode usar só o handleScroll pq só ele não esta atrelado ao scroll do windows
        const throttleHandleScroll = throttle(handleScroll, 150)
        window.addEventListener("scroll", throttleHandleScroll)
        return () => { //ajudar a n ter varios eventos de scroll acontecendo ao mesmo tempo
            window.removeEventListener("scroll", throttleHandleScroll);
        }
    }, [hasMoreData, isLoading])

  return (
    <div>
        <h1>Infinite scroll</h1>
        <ul>
            {posts.map((post) => (
                <li key={Math.random() * 1000}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </li>
            ))}
        </ul>
        {isLoading && <p>Loading more posts...</p>}
    </div>
  )
}

function throttle(func, delay) { //função para parar e rodar a chamada dos textos
    let lastCall = 0;

    return function(...args) {
        const now = new Date().getTime();
        if(now - lastCall < delay) return;
        lastCall = now;
        return func(...args)
    }
}

export default InfiniteScroll