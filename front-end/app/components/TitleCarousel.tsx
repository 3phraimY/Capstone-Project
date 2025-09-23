import type { Title } from '../hooks/listTablesTypes'
import TitlePoster from './TitlePoster'

export default function TitleCarousel({ titles }: { titles: Title[] }) {
  return (
    <div className='hide-scrollbar w-full max-w-2xl overflow-x-auto'>
      <div className='flex space-x-4 p-4 pt-0'>
        {titles.map(title => (
          <div key={title.TitleId} className='flex-shrink-0'>
            <TitlePoster title={title} />
          </div>
        ))}
      </div>
    </div>
  )
}
