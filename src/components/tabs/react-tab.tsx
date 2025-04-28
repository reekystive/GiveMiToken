import reactLogo from '@/assets/react.svg';
import { Avatar, Button, Card, CardFooter, CardHeader, CardPreview, Text, Title2 } from '@fluentui/react-components';
import { FC } from 'react';

export const ReactTab: FC = () => {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-2">
      <Title2 className="mb-4">React Components</Title2>
      <Card className="mx-auto w-full max-w-md" appearance="outline">
        <CardHeader
          image={<Avatar name="React" image={{ src: reactLogo }} />}
          header={<Text weight="semibold">React Framework</Text>}
          description={<Text size={200}>A JavaScript library for building user interfaces</Text>}
        />
        <CardPreview className="p-4">
          <Text>
            React lets you build user interfaces out of individual pieces called components. Create your own React
            components like Thumbnail, LikeButton, and Video.
          </Text>
        </CardPreview>
        <CardFooter>
          <Button appearance="primary">Learn More</Button>
          <Button appearance="outline">Documentation</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
