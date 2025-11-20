'use client'
import { useRef } from 'react'
import type { Title } from '../hooks/listTablesTypes'
import TitlePoster from './TitlePoster'

export default function TitleCarousel({ titles }: { titles: Title[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  let isDown = false
  let startX = 0
  let scrollLeft = 0

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true
    startX = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    scrollLeft = scrollRef.current?.scrollLeft ?? 0
    document.body.style.cursor = 'grabbing'
  }

  const onMouseLeave = () => {
    isDown = false
    document.body.style.cursor = ''
  }

  const onMouseUp = () => {
    isDown = false
    document.body.style.cursor = ''
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    const walk = x - startX
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  return (
    <div
      ref={scrollRef}
      className='hide-scrollbar w-full cursor-grab overflow-x-auto'
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className='flex space-x-4 pl-2'>
        {titles.map(title => (
          <div key={title.TitleId}>
            <TitlePoster
              title={title}
              className='h-[250px] w-[160px] rounded shadow'
            />
          </div>
        ))}
      </div>
    </div>
  )
}
