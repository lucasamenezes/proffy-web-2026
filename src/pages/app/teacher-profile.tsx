import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Camera } from "lucide-react"

import goBack from "../../assets/goback-another-purple.svg"
import proffyLogo from "../../assets/proffy-logo.svg"
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

const teacherProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Informe seu nome."),
  lastName: z.string().trim().min(1, "Informe seu sobrenome."),
  email: z.string().trim().email("Informe um e-mail válido."),
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

type TeacherProfileData = z.infer<typeof teacherProfileSchema>
type TeacherProfileInput = z.input<typeof teacherProfileSchema>

export function TeacherProfile() {
  const navigate = useNavigate()
  const storedProfile = getTeacherProfile()

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TeacherProfileInput, unknown, TeacherProfileData>({
    resolver: zodResolver(teacherProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: storedProfile.firstName,
      lastName: storedProfile.lastName,
      email: storedProfile.email,
      whatsapp: storedProfile.whatsapp,
      biography: storedProfile.biography,
      subject: storedProfile.subject,
      cost: storedProfile.cost ? String(storedProfile.cost) : "",
      schedule:
        storedProfile.schedule.length > 0
          ? storedProfile.schedule
          : [{ week_day: "", from: "", to: "" }],
    },
  })

  useEffect(() => {
    const profile = getTeacherProfile()
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      whatsapp: profile.whatsapp,
      biography: profile.biography,
      subject: profile.subject,
      cost: profile.cost ? String(profile.cost) : "",
      schedule:
        profile.schedule.length > 0
          ? profile.schedule
          : [{ week_day: "", from: "", to: "" }],
    })
  }, [reset])

  const whatsappValue = watch("whatsapp")
  const firstNameValue = watch("firstName")
  const lastNameValue = watch("lastName")
  const subjectValue = watch("subject")

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

  function handleRemoveScheduleItem(index: number) {
    if (scheduleItems.length > 1) {
      remove(index)
    } else {
      setValue("schedule.0.week_day", "", { shouldValidate: true })
      setValue("schedule.0.from", "", { shouldValidate: true })
      setValue("schedule.0.to", "", { shouldValidate: true })
    }
  }

  function handleSaveProfile(data: TeacherProfileData) {
    saveTeacherProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
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
            Meu perfil
          </h1>
          <img src={proffyLogo} alt="Proffy" className="w-12 h-4" />
        </header>
      </div>

      <div className="w-full flex flex-col items-center justify-center bg-purple h-[420px] pb-10">
        <div className="relative flex items-center justify-center">
          <img
            src={storedProfile.avatarUrl}
            alt={`${firstNameValue} ${lastNameValue}`}
            className="w-44 h-44 rounded-full object-cover"
          />
          <button
            type="button"
            title="Alterar foto"
            className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-green hover:bg-green-dark transition flex items-center justify-center cursor-pointer shadow-md"
          >
            <Camera size={24} className="text-white" />
          </button>
        </div>

        <h2 className="font-archivo-bold text-3xl text-white mt-6 text-center">
          {`${firstNameValue || ""} ${lastNameValue || ""}`.trim() ||
            "Rafael Rocha"}
        </h2>
        <span className="font-poppins-regular text-xl text-text-purple-base mt-2">
          {subjectValue || "Matéria não selecionada"}
        </span>
      </div>

      <main className="flex flex-col w-full max-w-4xl justify-center my-auto bg-white border-1 border-gray-lines-in-white rounded-lg -mt-[3.2rem] overflow-hidden pt-16 mb-16">
        <form onSubmit={handleSubmit(handleSaveProfile)} noValidate>
          <fieldset className="flex flex-col items-center mx-16">
            <legend className="flex w-full items-center justify-between pb-6 font-archivo-semibold text-2xl text-text-title border-b-1 border-gray-lines-in-white">
              Seus dados
            </legend>

            <div className="grid grid-cols-2 w-full gap-8 mt-8">
              <div className="flex flex-col w-full">
                <InputCustom
                  name="firstName"
                  label="Nome"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.firstName}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full">
                <InputCustom
                  name="lastName"
                  label="Sobrenome"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.lastName}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 w-full gap-8 mt-8">
              <div className="flex flex-col w-full col-span-3">
                <InputCustom
                  name="email"
                  label="E-mail"
                  type="email"
                  labelColor="text-text-complement"
                  bgColor="bg-white-shape"
                  register={register}
                  error={errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full col-span-2">
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
                    <span className="flex-1 border-t-1 border-gray-lines-in-white" />
                    <button
                      type="button"
                      className="font-archivo-semibold text-base text-red-500 cursor-pointer hover:text-red-600 transition"
                      onClick={() => handleRemoveScheduleItem(index)}
                    >
                      Excluir horário
                    </button>
                    <span className="flex-1 border-t-1 border-gray-lines-in-white" />
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
              className="flex gap-4 items-center bg-green hover:bg-green-dark cursor-pointer transition py-4 px-10 rounded-lg font-archivo-semibold text-base text-white"
            >
              Salvar cadastro
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
