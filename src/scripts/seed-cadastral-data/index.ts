require('dotenv').config();
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

import { createDirectoryInCwd, downloadFile, unzip } from './utils/file';
import {
  transformRuianData,
  trimCompleteRuianData,
} from './utils/xml-to-object-mapper';
import { cuzkUrlBuilder } from './utils/cuzk-file-url-builder';

import { RuianXMLDataset } from './types/ruian-data';
import { initMongoose } from '@models';
import { Region } from '@models/region';
import { Mop } from '@models/mop';
import { District } from '@models/district';
import { Momc } from '@models/momc';

(async () => {
  try {
    // mongoose connect
    await initMongoose();
    console.log('Connected to Mongo database.');

    const artifactsDirectory = '/artifacts';
    const artifactsDirectoryPath = createDirectoryInCwd(artifactsDirectory);

    const cadastralDataDirectory = '/cadastral-data';
    const cadastralDataDirectoryPath = createDirectoryInCwd(
      cadastralDataDirectory,
    );

    // keep 2022-06-30 because in July 2022 Prague district becomes hidden
    const fileDateString = '2022-06-30';
    const fileDate = new Date(fileDateString);

    let targetFilePath = cadastralDataDirectoryPath + `/${fileDateString}.zip`;

    try {
      fs.readFileSync(targetFilePath);
      console.log('File exists (from repository), skip downloading...');
    } catch (error) {
      targetFilePath = artifactsDirectoryPath + `/${fileDateString}.zip`;
      try {
        fs.readFileSync(targetFilePath);
        console.log('File exists (from artifacts), skip downloading...');
      } catch (error) {
        // file does not exist
        console.log(
          `${targetFilePath} file does not exist, downloading CUZK file...`,
        );
        console.log(cuzkUrlBuilder(fileDate));

        try {
          await downloadFile(cuzkUrlBuilder(fileDate), targetFilePath);
        } catch (error) {
          console.error(
            'File access has expired and the file is no longer reachable.',
          );
          process.exit(0);
        }
      }
    }

    console.log('Unzipping file...');
    const [filePath] = await unzip(targetFilePath, artifactsDirectory);

    const file = fs.readFileSync(filePath);

    const parser = new XMLParser();

    const parsedResult = parser.parse(file) as RuianXMLDataset;

    const trimmedRuianData = trimCompleteRuianData(
      parsedResult['vf:VymennyFormat']['vf:Data'],
    );

    console.log('Transforming file...');
    const { regions, districts, mops, momcs } =
      transformRuianData(trimmedRuianData);

    console.log('Bulk saving Region...');
    await Promise.all(
      regions.map(async (region) => {
        await Region.updateOne({ _id: region._id }, region, {
          upsert: true,
          strict: false,
        });
      }),
    );

    console.log('Bulk saving District...');
    await Promise.all(
      districts.map(async (district) => {
        await District.updateOne({ _id: district._id }, district, {
          upsert: true,
          strict: false,
        });
      }),
    );

    console.log('Bulk saving Mops...');
    await Promise.all(
      mops.map(async (mop) => {
        await Mop.updateOne({ _id: mop._id }, mop, {
          upsert: true,
          strict: false,
        });
      }),
    );

    console.log('Bulk saving Momc...');
    await Promise.all(
      momcs.map(async (momc) => {
        await Momc.updateOne({ _id: momc._id }, momc, {
          upsert: true,
          strict: false,
        });
      }),
    );
    console.log('DONE!');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
})();
