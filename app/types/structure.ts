export type Confidence = "low" | "medium" | "high";

export type FieldValue<T> = {
  value: T;
  confidence: Confidence;
};

export type AlertItem = {
  type: string;
  message: string;
};

export type StructuredResult = {
  motivo_consulta: FieldValue<string>;
  signos_vitales: {
    temp: FieldValue<number | null>;
    fc: FieldValue<number | null>;
    pa: FieldValue<string | null>;
    spo2: FieldValue<number | null>;
  };
  sintomas: Array<FieldValue<string>>;
  antecedentes: Array<FieldValue<string>>;
  alergias: Array<FieldValue<string>>;
  medicacion_actual: Array<FieldValue<string>>;
  observaciones: FieldValue<string | null>;
  alertas: AlertItem[];
};