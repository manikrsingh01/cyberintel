import seedData from "../../data/seed_companies.json";
import { Company } from "./types";
import { scoreCompanyHybrid } from "./scoring";

export const initialCompanies: Company[] = (seedData as Partial<Company>[]).map(c => scoreCompanyHybrid(c));
