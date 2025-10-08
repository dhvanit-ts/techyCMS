type RawDataset = { [key: string]: unknown };
type RawInput = {
  labels?: (string | number)[];
  datasets?: RawDataset[];
};

function formatAndTransform(raw: RawInput) {
  // Step 1: normalize
  const labels = raw.labels ?? [];
  const datasets = (raw.datasets ?? []).map((ds, i) => ({
    name: (ds.name as string) ?? `Dataset ${i + 1}`,
    data: (ds.data as unknown[]) ?? [],
  }));

  // Step 2: pivot
  const maxLength = Math.max(labels.length, ...datasets.map((d) => d.data.length));

  return Array.from({ length: maxLength }, (_, i) => {
    const row: Record<string, unknown> = { x: labels[i] ?? i };
    datasets.forEach((d) => {
      row[d.name] = d.data[i] ?? null;
    });
    return row;
  });
}

export default formatAndTransform;
