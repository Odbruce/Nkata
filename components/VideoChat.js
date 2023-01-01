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