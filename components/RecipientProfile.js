import styled from '@emotion/styled'
import React from 'react'

const RecipientProfile = () => {
  return (
    <Wrappper>RecipientProfile</Wrappper>
  )
}

export default RecipientProfile

const Wrappper = styled.div`
flex:1;
background:purple;
height:100vh;
transition:0.8s;


@media(max-width:820px){
    width:100vw;
    translate:100%;
    position:absolute;
    top:0;
    right:0;

}
`