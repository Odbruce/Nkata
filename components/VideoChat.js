import styled from '@emotion/styled'
import React from 'react'
import {MdCallEnd} from "react-icons/md"

const VideoChat = () => {
  return (
    <Wrapper>
        <Button>
            <EndCall>
                <MdCallEnd/>
            </EndCall>
        </Button>
    </Wrapper>
  )
}

export default VideoChat

const Wrapper = styled.section`
`

const Button = styled.div`
`
const EndCall =styled.button`
`