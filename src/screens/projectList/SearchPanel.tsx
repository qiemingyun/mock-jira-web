import { Input, Form } from 'antd';
import { UserSelect } from '../../components/userSelect';
import { User } from '../../types/user';

interface SearchPanelProps {
  users: User[];
  param: {
    keyword: string;
    principalId: number | undefined;
  };
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: '2rem' }} layout={'inline'}>
      <Form.Item>
        <Input
          placeholder={'Project Name'}
          type="text"
          value={param.keyword}
          onChange={(e) =>
            setParam({
              ...param,
              keyword: e.target.value,
            })
          }
        />
      </Form.Item>

      <Form.Item>
        <UserSelect
          defaultOptionName={'Principal'}
          value={param.principalId}
          onChange={(value) =>
            setParam({
              ...param,
              principalId: value,
            })
          }
        ></UserSelect>
      </Form.Item>
    </Form>
  );
};
