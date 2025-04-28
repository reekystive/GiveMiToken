import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Input,
  Option,
  Title2,
  Title3,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarToggleButton,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Delete24Regular,
  Edit24Regular,
  Eye24Regular,
  Filter24Regular,
  Search24Regular,
} from '@fluentui/react-icons';
import { FC, useId, useState } from 'react';

export const FluentTab: FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropdownId = useId();

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-6">
      <Title2 className="mb-4">Fluent UI Components</Title2>

      <div className="mb-6 flex w-full flex-col gap-2">
        <Title3 className="mb-2">Toolbar</Title3>
        <Toolbar className="mb-4 flex flex-row items-center gap-2">
          <ToolbarButton icon={<Add24Regular />} aria-label="Add" />
          <ToolbarButton icon={<Edit24Regular />} aria-label="Edit" />
          <ToolbarButton icon={<Delete24Regular />} aria-label="Delete" />
          <ToolbarDivider />
          <ToolbarToggleButton icon={<Filter24Regular />} aria-label="Filter" name="filter" value="filter" />
          <ToolbarToggleButton icon={<Eye24Regular />} aria-label="View" name="view" value="view" />
          <ToolbarDivider />
          <div className="relative flex items-center">
            <Search24Regular className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </Toolbar>
      </div>

      <div className="mb-6 flex w-full flex-col gap-2">
        <Field label="Framework" className="mb-2 max-w-xs">
          <Dropdown
            id={dropdownId}
            placeholder="Select a framework"
            value={selectedFramework ?? undefined}
            onOptionSelect={(_, data) => setSelectedFramework(data.optionValue ?? null)}
          >
            <Option value="react">React</Option>
            <Option value="vue">Vue</Option>
            <Option value="angular">Angular</Option>
            <Option value="svelte">Svelte</Option>
          </Dropdown>
        </Field>
      </div>

      <div className="mb-6 flex w-full flex-col gap-2">
        <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="primary">Open Dialog</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <div className="flex flex-col gap-4">
                <DialogTitle>Welcome to Fluent UI</DialogTitle>
                <DialogContent>
                  This is a Fluent UI Dialog component. Dialogs are used to get user confirmation or to present
                  information related to the current workflow.
                </DialogContent>
                <DialogActions className="flex flex-row justify-end gap-2">
                  <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button appearance="primary" onClick={() => setIsDialogOpen(false)}>
                    Confirm
                  </Button>
                </DialogActions>
              </div>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>

      <div className="mb-6 flex w-full flex-col gap-2">
        <Title3 className="mb-2">Badges</Title3>
        <div className="flex flex-row flex-wrap gap-2">
          <Badge appearance="filled" color="brand">
            Brand
          </Badge>
          <Badge appearance="filled" color="danger">
            Danger
          </Badge>
          <Badge appearance="filled" color="important">
            Important
          </Badge>
          <Badge appearance="filled" color="informative">
            Info
          </Badge>
          <Badge appearance="filled" color="subtle">
            Subtle
          </Badge>
          <Badge appearance="filled" color="success">
            Success
          </Badge>
        </div>
      </div>
    </div>
  );
};
