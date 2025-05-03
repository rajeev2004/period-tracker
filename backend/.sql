CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE,
  cramps BOOLEAN DEFAULT FALSE,
  headache BOOLEAN DEFAULT FALSE,
  fatigue BOOLEAN DEFAULT FALSE,
  nausea BOOLEAN DEFAULT FALSE,
  mood_swings BOOLEAN DEFAULT FALSE,
  bloating BOOLEAN DEFAULT FALSE,
  notes TEXT,
  flow_intensity TEXT,
  flow_color TEXT,
  clotting TEXT;
);
