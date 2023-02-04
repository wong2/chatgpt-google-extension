import { useCallback } from 'react'
import { captureEvent } from '../analytics'
import type { PromotionResponse } from '../api'

interface Props {
  data: PromotionResponse
}

function Promotion({ data }: Props) {
  const capturePromotionClick = useCallback(() => {
    captureEvent('click_promotion', { link: data.url })
  }, [data.url])

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noreferrer"
      onClick={capturePromotionClick}
      className="gpt-promotion-link"
    >
      <div className="chat-gpt-card flex flex-row gap-2 mt-5 gpt-promotion">
        {!!data.image && (
          <img
            src={data.image.url}
            width={data.image.size || 100}
            height={data.image.size || 100}
          />
        )}
        <div className="flex flex-col justify-between">
          <div>
            {!!data.title && <p className="font-bold">{data.title}</p>}
            {!!data.text && <p>{data.text}</p>}
          </div>
          <div className="flex flex-row justify-between">
            {!!data.footer && <span className="text-xs underline">{data.footer.text}</span>}
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
    </a>
  )
}

export default Promotion
