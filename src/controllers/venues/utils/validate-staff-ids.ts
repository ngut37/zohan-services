import { Staff } from '@models/staff';

export const validateStaffIds = async (
  staffIds: string[],
): Promise<boolean> => {
  const staff = await Staff.find({ id: { $in: staffIds } });

  const companyIdsSet = new Set<string>();

  staff.forEach((staffPerson) =>
    companyIdsSet.add(staffPerson.company.toString()),
  );

  return companyIdsSet.size <= 1;
};
