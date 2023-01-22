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
    <div className="chat-gpt-card flex flex-row gap-2 mt-5 gpt-promotion">
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
        <div>
          {!!data.title && (
            <a href={data.url} target="_blank" rel="noreferrer">
              <p className="font-bold">{data.title}</p>
            </a>
          )}
          {!!data.text &&
            (data.title ? (
              <p>{data.text}</p>
            ) : (
              <a href={data.url} target="_blank" rel="noreferrer">
                <p>{data.text}</p>
              </a>
            ))}
        </div>
        <div className="flex flex-row justify-between">
          {!!data.footer && (
            <a href={data.footer.url} target="_blank" rel="noreferrer" className="text-xs">
              {data.footer.text}
            </a>
          )}
          {!!data.label && (
            <a
              href={data.label.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs rounded-sm border border-solid px-[2px] text-inherit"
            >
              {data.label.text}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Promotion
