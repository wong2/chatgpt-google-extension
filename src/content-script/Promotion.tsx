import { useCallback } from 'react'
import { captureEvent } from '../analytics'
import { PromotionResponse } from './api'

interface Props {
  data: PromotionResponse
}

function Promotion({ data }: Props) {
  const capturePromotionClick = useCallback(() => {
    captureEvent('click_promotion', { link: data.url })
  }, [data.url])

  if (data.image && !data.text) {
    return (
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5"
        onClick={capturePromotionClick}
      >
        <img src={data.image.url} className="w-full" />
      </a>
    )
  }
  return (
    <div className="chat-gpt-card flex flex-row gap-2 mt-5 gpt-promotion">
      {!!data.image && (
        <a href={data.url} target="_blank" rel="noreferrer" onClick={capturePromotionClick}>
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
            <a href={data.url} target="_blank" rel="noreferrer" onClick={capturePromotionClick}>
              <p className="font-bold">{data.title}</p>
            </a>
          )}
          {!!data.text &&
            (data.title ? (
              <p>{data.text}</p>
            ) : (
              <a href={data.url} target="_blank" rel="noreferrer" onClick={capturePromotionClick}>
                <p>{data.text}</p>
              </a>
            ))}
        </div>
        <div className="flex flex-row justify-between">
          {!!data.footer && (
            <a
              href={data.footer.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs"
              onClick={capturePromotionClick}
            >
              {data.footer.text}
            </a>
          )}
          {!!data.label && (
            <a
              href={data.label.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs rounded-sm border border-solid px-[2px] text-inherit"
              onClick={capturePromotionClick}
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
