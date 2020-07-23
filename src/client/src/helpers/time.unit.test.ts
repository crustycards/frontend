import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';
import {convertTime} from './time';

const seconds = (count: number) => (count * 1000);
const minutes = (count: number) => (seconds(count) * 60);
const hours = (count: number) => (minutes(count) * 60);
const days = (count: number) => (hours(count) * 24);

describe('time', () => {
  const millisNow = 1535300000000;
  const now = new Date(millisNow);

  it('should convert to just now', () => {
    expect(convertTime(now, now)).toEqual('just now');
    expect(convertTime(new Date(millisNow - seconds(1)), now)).toEqual('just now');
    expect(convertTime(new Date(millisNow - seconds(1.999)), now)).toEqual('just now');
  });

  it('should convert to seconds', () => {
    expect(convertTime(new Date(millisNow - seconds(2)), now)).toEqual('2 seconds ago');
    expect(convertTime(new Date(millisNow - seconds(10)), now)).toEqual('10 seconds ago');
    expect(convertTime(new Date(millisNow - seconds(30)), now)).toEqual('30 seconds ago');
    expect(convertTime(new Date(millisNow - seconds(59.999)), now)).toEqual('59 seconds ago');
  });

  it('should convert to minutes', () => {
    expect(convertTime(new Date(millisNow - minutes(1)), now)).toEqual('1 minute ago');
    expect(convertTime(new Date(millisNow - minutes(1.999)), now)).toEqual('1 minute ago');
    expect(convertTime(new Date(millisNow - minutes(2)), now)).toEqual('2 minutes ago');
    expect(convertTime(new Date(millisNow - minutes(30)), now)).toEqual('30 minutes ago');
    expect(convertTime(new Date(millisNow - minutes(59.999)), now)).toEqual('59 minutes ago');
  });

  it('should convert to hours', () => {
    expect(convertTime(new Date(millisNow - hours(1)), now)).toEqual('1 hour ago');
    expect(convertTime(new Date(millisNow - hours(1.999)), now)).toEqual('1 hour ago');
    expect(convertTime(new Date(millisNow - hours(2)), now)).toEqual('2 hours ago');
    expect(convertTime(new Date(millisNow - hours(12)), now)).toEqual('12 hours ago');
    expect(convertTime(new Date(millisNow - hours(23.999)), now)).toEqual('23 hours ago');
  });

  it('should convert to days', () => {
    expect(convertTime(new Date(millisNow - days(1)), now)).toEqual('on August 25 2018');
    expect(convertTime(new Date(millisNow - days(365)), now)).toEqual('on August 26 2017');
    expect(convertTime(new Date(millisNow - days(100)), now)).toEqual('on May 18 2018');
  });

  it('should convert timestamp proto', () => {
    const timeStamp = new Timestamp();
    // Could be either value depending on
    // the time zone these tests are run in.
    expect([
      'on December 31 1969',
      'on January 1 1970'
    ]).toContainEqual(convertTime(timeStamp, now));
    timeStamp.setSeconds(new Date(millisNow).getTime() / 1000);
    expect(convertTime(timeStamp, now)).toEqual('just now');
    timeStamp.setSeconds(timeStamp.getSeconds() - 2);
    expect(convertTime(timeStamp, now)).toEqual('2 seconds ago');
    timeStamp.setNanos(2000000000); // 2 seconds.
    expect(convertTime(timeStamp, now)).toEqual('just now');
  });
});
