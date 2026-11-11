import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import goBack from "../../assets/goback-another-purple.svg"
import proffyLogo from "../../assets/proffy-logo.svg"
import rocketIcon from "../../assets/rocket.svg"
import attentionIcon from "../../assets/attention.svg"

import { InputCustom } from "../../components/input-custom"
import { TextArea } from "../../components/text-area"
import { Select } from "../../components/select"
import {
  formatWhatsappMask,
  getTeacherProfile,
  saveTeacherProfile,
  SUBJECT_OPTIONS,
  WEEK_DAY_OPTIONS,
} from "../../utils/teacher-storage"

const scheduleItemSchema = z
  .object({
    week_day: z.string().min(1, "Selecione o dia da semana."),
    from: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário inicial."),
    to: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário final."),
  })
  .refine(({ from, to }) => from < to, {
    message: "O horário final deve ser posterior ao inicial.",
    path: ["to"],
  })

const teacherFormSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Informe um WhatsApp válido."),
  biography: z
    .string()
    .trim()
    .min(1, "Informe sua biografia.")
    .max(300, "A biografia pode ter no máximo 300 caracteres."),
  subject: z.string().min(1, "Selecione a matéria."),
  cost: z.coerce
    .number({ error: "Informe o custo da sua hora-aula." })
    .positive("O custo deve ser maior que zero."),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, "Adicione ao menos um horário disponível."),
})

type TeacherFormData = z.infer<typeof teacherFormSchema>
type TeacherFormInput = z.input<typeof teacherFormSchema>

export function TeacherForms() {
  const navigate = useNavigate()
  const storedTeacher = getTeacherProfile()

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitted, isValid },
  } = useForm<TeacherFormInput, unknown, TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    mode: "onChange",
    defaultValues: {
      whatsapp: "",
      biography: "",
      subject: "",
      cost: "",
      schedule: [{ week_day: "", from: "", to: "" }],
    },
  })

  const whatsappValue = watch("whatsapp")

  useEffect(() => {
    if (typeof whatsappValue === "string") {
      const masked = formatWhatsappMask(whatsappValue)
      if (masked !== whatsappValue) {
        setValue("whatsapp", masked, { shouldValidate: true })
      }
    }
  }, [whatsappValue, setValue])

  const {
    fields: scheduleItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "schedule",
  })

  function addNewScheduleItem() {
    append({ week_day: "", from: "", to: "" })
  }

  function handleCreateClass(data: TeacherFormData) {
    saveTeacherProfile({
      whatsapp: data.whatsapp,
      biography: data.biography,
      subject: data.subject,
      cost: data.cost,
      schedule: data.schedule,
    })

    navigate("/give-classes/register-completed")
  }

  return (
    <div className="w-full min-h-screen items-center flex flex-col align-top bg-background antialiased overflow-x-hidden">
      <div className="w-full flex flex-row justify-center items-center bg-dark-purple h-[64px]">
        <header className="flex w-full justify-between items-center max-w-7xl">
          <Link to={"/"}>
            <img src={goBack} alt="Voltar" className="w-8 h-12" />
          </Link>
          <h1 className="text-text-purple-base font-archivo-semibold text-base">
            Dar aulas
          </h1>
          <img src={proffyLogo} alt="Proffy" className="w-12 h-4" />
        </header>
      </div>

      <div className="w-full flex flex-col items-center bg-purple h-[352px]">
        <div className="flex w-full justify-between items-center max-w-4xl mt-[64px]">
          <h1 className="font-archivo-bold text-4xl text-white">
            Que incrível que você
            <br />
            quer dar aulas.
          </h1>
        </div>
        <div className="flex justify-between items-center w-full max-w-4xl mt-[24px]">
          <h1 className="font-poppins-regular text-base text-text-purple-base">
            O primeiro passo, é preencher esse
            <br /> formulário de inscrição.
          </h1>

          <div className="flex flex-row gap-4 items-center">
            <img src={rocketIcon} alt="" className="w-8 h-8" />
            <span className="font-poppins-regular text-sm text-text-purple-base">
              Prepare-se!
              <br />
              vai ser o máximo.
            </span>
          </div>
        </div>
      </div>

      <main className="flex flex-col w-full max-w-4xl justify-center my-auto bg-white border-1 border-gray-lines-in-white rounded-lg -mt-[3.2rem] overflow-hidden pt-16 mb-16">
        <form onSubmit={handleSubmit(handleCreateClass)} noValidate>
          <fieldset className="flex flex-col items-center mx-16">
            <legend className="flex w-full items-center justify-between pb-10 mb-10 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Seus Dados
            </legend>

            <div className="flex flex-row w-full justify-between">
              <div className="flex items-center">
                <img
                  className="w-[5rem] h-[5rem] rounded-full"
                  src={storedTeacher.avatarUrl}
                  alt={`${storedTeacher.firstName} ${storedTeacher.lastName}`}
                />
                <strong className="font-archivo-semibold text-2xl text-text-title block ms-6">
                  {`${storedTeacher.firstName} ${storedTeacher.lastName}`}
                </strong>
              </div>

              <div className="flex flex-col">
                <InputCustom
                  name="whatsapp"
                  label="Whatsapp"
                  placeholder="( ) _ ____ ____"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.whatsapp}
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col w-full max-w-full mt-8">
              <TextArea
                name="biography"
                label="Biografia"
                labelColor="text-text-complement"
                bgColor="bg-white-shape"
                maxLength={300}
                register={register}
                error={errors.biography}
                spanLabel="(Máximo 300 caracteres)"
              />
              {errors.biography && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.biography.message}
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
            <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Sobre a aula
            </legend>

            <div className="grid grid-cols-5 w-full gap-8">
              <div className="flex flex-col w-full mt-8 col-span-3">
                <Select
                  name="subject"
                  label="Matéria"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.subject}
                  optionDefault="Selecione qual você quer ensinar"
                  options={SUBJECT_OPTIONS}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full mt-8 col-span-2">
                <InputCustom
                  name="cost"
                  label="Custo da sua hora por aula"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  placeholder="R$"
                  type="number"
                  min="0.01"
                  step="0.01"
                  register={register}
                  error={errors.cost}
                />
                {errors.cost && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.cost.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="flex flex-col items-center justify-between mx-16 mt-16">
            <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Horários disponíveis
              <button
                type="button"
                className="text-base text-purple cursor-pointer hover:text-dark-purple transition"
                onClick={addNewScheduleItem}
              >
                + Novo horário
              </button>
            </legend>

            {scheduleItems.map((scheduleItem, index) => {
              return (
                <div key={scheduleItem.id} className="w-full">
                  <div className="grid grid-cols-4 w-full gap-8 mb-4">
                    <div className="flex flex-col mt-8 col-span-2">
                      <Select
                        name={`schedule.${index}.week_day`}
                        label="Dia da semana"
                        labelColor="text-text-complement"
                        bgColor="bg-white-shape"
                        register={register}
                        error={errors.schedule?.[index]?.week_day}
                        optionDefault="Selecione o dia"
                        options={WEEK_DAY_OPTIONS}
                      />
                      {errors.schedule?.[index]?.week_day && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.schedule[index].week_day.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col w-full mt-8 col-span-1">
                      <InputCustom
                        name={`schedule.${index}.from`}
                        label="Das"
                        labelColor="text-text-complement"
                        bgColor="bg-white-shape"
                        type="time"
                        register={register}
                        error={errors.schedule?.[index]?.from}
                      />
                      {errors.schedule?.[index]?.from && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.schedule[index].from.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col w-full mt-8 col-span-1">
                      <InputCustom
                        name={`schedule.${index}.to`}
                        label="Até"
                        labelColor="text-text-complement"
                        bgColor="bg-white-shape"
                        type="time"
                        register={register}
                        error={errors.schedule?.[index]?.to}
                      />
                      {errors.schedule?.[index]?.to && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.schedule[index].to.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-8 pb-8">
                    {index === 0 ? (
                      <span className="w-full border-t-1 border-gray-lines-in-white" />
                    ) : (
                      <>
                        <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                        <button
                          type="button"
                          className="font-archivo-semibold text-base text-red-500 cursor-pointer hover:text-red-600 transition"
                          onClick={() => remove(index)}
                        >
                          Excluir horário
                        </button>
                        <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </fieldset>

          <div className="flex w-full px-16 mt-10 bg-white-shape items-center justify-between py-8 border-t-1 border-gray-lines-in-white">
            <div className="flex gap-4">
              <img
                src={attentionIcon}
                alt="Aviso importante"
                className="w-8 h-8"
              />
              <p className="font-poppins-regular text-xs text-purple items-center">
                Importante!
                <br />
                <span className="font-poppins-regular text-xs text-text-complement">
                  Preencha todos os dados corretamente.
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitted || !isValid}
              className="flex gap-4 items-center bg-green hover:bg-green-dark disabled:bg-gray-shape disabled:text-text-complement disabled:cursor-not-allowed cursor-pointer transition py-4 px-10 rounded-lg font-archivo-semibold text-base text-white"
            >
              Salvar cadastro
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
