import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  HomerContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { NewClycleForm } from './components/NewClycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext } from '../../context/CyclesContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'informe uma Tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo de 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo de 60  minutos'),
})

type NewCyclesFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { interruptCurrentCycle, createNewCycle, activeCycle } =
    useContext(CyclesContext)
  const newCycleForm = useForm<NewCyclesFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      // valores inicias do formulário
      task: '',
      minutesAmount: 0,
    },
  }) // adicionando um outro formulário

  const { handleSubmit, watch, reset } = newCycleForm

  const task = watch('task') // assitir as mudanças do input

  function handleCreateNewCycle(data: NewCyclesFormData) {
    createNewCycle(data)
    reset() // resetar o formulário
  }

  const isSubmitDisabled = !task

  return (
    <HomerContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewClycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomerContainer>
  )
}
