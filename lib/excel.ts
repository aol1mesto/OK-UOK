import * as XLSX from "xlsx";

type SheetRow = Record<string, string | number | boolean | null | undefined>;

export function buildWorkbookBuffer(
  sheetName: string,
  rows: SheetRow[],
): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const arrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}

export function weeklyReportToRows(data: {
  weekStart: string;
  weekEnd: string;
  department: string;
  inspectionsCount: number;
  violationsFound: number;
  violationsFixed: number;
  trainingCompleted: boolean;
  riskLevel: string;
  summary: string;
  recommendations?: string;
  notes?: string;
}) {
  return [
    { Поле: "Начало недели", Значение: data.weekStart },
    { Поле: "Конец недели", Значение: data.weekEnd },
    { Поле: "Подразделение", Значение: data.department },
    { Поле: "Проверок проведено", Значение: data.inspectionsCount },
    { Поле: "Нарушений выявлено", Значение: data.violationsFound },
    { Поле: "Нарушений устранено", Значение: data.violationsFixed },
    {
      Поле: "Обучение проведено",
      Значение: data.trainingCompleted ? "Да" : "Нет",
    },
    { Поле: "Уровень риска", Значение: data.riskLevel },
    { Поле: "Итог", Значение: data.summary },
    { Поле: "Рекомендации", Значение: data.recommendations ?? "" },
    { Поле: "Примечания", Значение: data.notes ?? "" },
  ];
}
