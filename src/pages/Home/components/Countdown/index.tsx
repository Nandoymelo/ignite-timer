import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../context/CyclesContext'

import { CountDownContainer, Separator } from '../../styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecundsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const TotalSecunds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // Convertendo para segundos

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          // diferença entre a data atual para a data que se iniciou o ciclo
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= TotalSecunds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(TotalSecunds) // ficar zerado
          clearInterval(interval) // para de executar o interval
        } else {
          setSecondsPassed(secondsDifference) // CASO o secondsDifference não tenha finalizado, contínua atualizando o ciclo
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    TotalSecunds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

  const currentSecunds = activeCycle ? TotalSecunds - amountSecundsPassed : 0

  const minutesAmount = Math.floor(currentSecunds / 60)

  const secondsAmount = currentSecunds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const secunds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    // mudando o title da página
    if (activeCycle) {
      document.title = `Ignite Timer => ${minutes}:${secunds}`
    }
  }, [minutes, secunds, activeCycle])
  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{secunds[0]}</span>
      <span>{secunds[1]}</span>
    </CountDownContainer>
  )
}
