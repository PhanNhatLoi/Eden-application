import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {t} from 'i18next';
import {Colors} from 'src/styles';
import {ICON} from 'src/assets';
import {Hr} from 'src/scenes/season/components/SeasonDetails/styles';
import {styleSheet} from 'src/styles/styleSheet';
import {styles} from '../styles';
import * as RootNavigation from 'src/navigations/root-navigator';
import {SCREEN_NAME} from 'src/navigations/screen-name';
import {DIARY} from 'src/api/diary/type.d';
import {OptionType, RenderStatusSeaSon} from 'src/api/appData/type';
import IconFigma from 'src/components/organisms/ui/Image/IconFigma';

type Props = {
  data: DIARY.Response.Diary;
  index: number;
  countTimeLine: number;
  farmingSeasonId: number | null;
  seasonList: OptionType[];
};

const LogComponent = (props: Props) => {
  const {data, index, countTimeLine, seasonList} = props;
  return (
    <View>
      {data.works?.length > 0 && (
        <View style={styles.iconTitle}>
          <IconFigma name="clock" />
          <Text
            style={{
              ...styles.textKey,
              ...styleSheet.textStyleBold,
              color: Colors.SYS_BUTTON,
              marginLeft: 11,
              lineHeight: 20,
            }}>
            {new Date(data.createdDate || '').toLocaleString('vi-VN')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              RootNavigation.navigate(SCREEN_NAME.DIARY_WORKS, {
                farmingSeasonId: props.farmingSeasonId,
                data: data,
                seasonList: seasonList,
              });
            }}
            style={[
              {
                flex: 1,
              },
            ]}>
            <Text
              style={[
                styleSheet.textStyleBasic,
                {
                  color: Colors.SYS_BUTTON,
                  lineHeight: 20,
                  fontSize: 10,
                  fontStyle: 'italic',
                  textAlign: 'right',
                },
              ]}>
              {t('view_details')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          ...styles.logBox,
          borderLeftWidth: index === countTimeLine - 1 ? 0 : 1,
        }}>
        {data.works?.map((m: DIARY.Basic.WorkType, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                RootNavigation.navigate(SCREEN_NAME.DIARY_ADD_WORKS, {
                  work: data.works[index],
                  farmingSeasonId: data.farmingSeasonId,
                  viewForm: true,
                  seasonList: seasonList,
                  index: index,
                  infor: data,
                });
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: '90%',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.title}>{m.name}</Text>
                  </View>
                  <View style={[styles.row]}>
                    <Text style={styles.textKey}>{t('perfomer')}:</Text>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        width: '65%',
                      }}>
                      <Text style={styles.textValue}>
                        {data.sysAccountName || ''}
                      </Text>
                    </View>
                  </View>

                  {m.description && (
                    <View style={[styles.row]}>
                      <Text style={styles.textKey}>
                        {t('work_description')}:
                      </Text>
                      <Text
                        style={[
                          styles.textValue,
                          {
                            textAlign: 'right',
                            width: '65%',
                          },
                        ]}>
                        {m.description || t('no_data')}
                      </Text>
                    </View>
                  )}
                  {data.seasonStatus && (
                    <View style={[styles.row]}>
                      <Text style={styles.textKey}>{t('status')}:</Text>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          width: '65%',
                        }}>
                        <Text style={styles.textValue}>
                          {RenderStatusSeaSon(data.seasonStatus, 11)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    // flex: 1,
                    width: '10%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <IconFigma name="arrow_r" />
                </View>
              </View>
              {index < data.works.length - 1 && <Hr />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default LogComponent;
