enum Type {
  BACKEND = "backend",
  FRONTEND = "frontend",
  DATA_ENGINEERING = "data-engineering",
  VERSION_CONTROL = "version-control",
  CLOUD = "cloud",
}

export const frontend = [
  {
    type: Type.FRONTEND,
    skill: "HTML",
  },
  {
    type: Type.FRONTEND,
    skill: "CSS",
  },
  {
    type: Type.FRONTEND,
    skill: "JS/TS",
  },
  {
    type: Type.FRONTEND,
    skill: "ReactJs/Redux",
  },
];

export const versionControl = [
  {
    type: Type.VERSION_CONTROL,
    skill: "Git/GitHub",
  },
];

export const cloud = [
  {
    type: Type.CLOUD,
    skill: "AWS",
  },
];

export const backend = [
  {
    type: Type.BACKEND,
    skill: "NestJS",
  },
  {
    type: Type.BACKEND,
    skill: "NodeJs",
  },
  {
    type: Type.BACKEND,
    skill: "Grpahql",
  },
  {
    type: Type.BACKEND,
    skill: "PostgreSQL",
  },
  {
    type: Type.BACKEND,
    skill: "Mongodb",
  },
  {
    type: Type.BACKEND,
    skill: "Rabbitmq",
  },
  {
    type: Type.BACKEND,
    skill: "Docker",
  },
];

export const dataEngineering = [
  {
    type: Type.DATA_ENGINEERING,
    skill: "Python",
  },
  {
    type: Type.DATA_ENGINEERING,
    skill: "Airflow",
  },
  {
    type: Type.DATA_ENGINEERING,
    skill: "ETL",
  },
  {
    type: Type.DATA_ENGINEERING,
    skill: "PySpark",
  },
];
