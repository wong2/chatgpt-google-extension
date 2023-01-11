import { PromotionResponse } from './api'

interface Props {
  data: PromotionResponse
}

function Promotion({ data }: Props) {
  if (data.image && !data.text) {
    return (
      <a href={data.url} target="_blank" rel="noreferrer" className="mt-5">
        <img src={data.image.url} className="w-full" />
      </a>
    )
  }
  return (
    <div className="chat-gpt-card flex flex-row gap-4 mt-5 gpt-promotion">
      {!!data.image && (
        <a href={data.url} target="_blank" rel="noreferrer">
          <img
            src={data.image.url}
            width={data.image.size || 100}
            height={data.image.size || 100}
          />
        </a>
      )}
      <div className="flex flex-col justify-between">
        <a href={data.url} target="_blank" rel="noreferrer">
          <p>{data.text}</p>
        </a>
        {!!data.footer && (
          <a href={data.footer.url} target="_blank" rel="noreferrer">
            <span className="text-xs">{data.footer.text}</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default Promotion
