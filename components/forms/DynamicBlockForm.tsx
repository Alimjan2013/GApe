'use client'

import { useForm, type DefaultValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Block } from "@/types"
import { blockFormConfigs, type FieldConfig } from "./formSchemas"
import type { ProfileCardProps, ProjectCardProps, EducationCardProps, PublicationCardProps, ExperienceCardProps } from "@/types"
import { ImageUpload } from "./ImageUpload"
import { createClient } from "@/utils/supabase/client"

type BlockData = ProfileCardProps | ProjectCardProps | EducationCardProps | PublicationCardProps | ExperienceCardProps

interface DynamicBlockFormProps<T extends BlockData> {
    block: Block
    onSave: (block: Block) => void
}

interface FileValue {
    file?: File;
    url?: string;
}

export function DynamicBlockForm<T extends BlockData>({ block, onSave }: DynamicBlockFormProps<T>) {
    const supabase = createClient();

    // Generate Zod schema dynamically based on block type
    const generateZodSchema = (config: Record<string, FieldConfig>) => {
        const schema: Record<string, any> = {}
        
        for (const [fieldName, fieldConfig] of Object.entries(config)) {
            if (fieldConfig.type === 'upload') {
                schema[fieldName] = z.any()
            } else {
                let fieldSchema = z.string()
                if (fieldConfig.validation) {
                    if (fieldConfig.validation.required) {
                        fieldSchema = fieldSchema.min(1, "This field is required")
                    }
                    if (fieldConfig.validation.min) {
                        fieldSchema = fieldSchema.min(fieldConfig.validation.min)
                    }
                    if (fieldConfig.validation.max) {
                        fieldSchema = fieldSchema.max(fieldConfig.validation.max)
                    }
                    if (fieldConfig.validation.email) {
                        fieldSchema = fieldSchema.email("Invalid email address")
                    }
                    if (fieldConfig.validation.url) {
                        fieldSchema = fieldSchema.url("Invalid URL")
                    }
                }
                schema[fieldName] = fieldSchema
            }
        }
        
        return z.object(schema)
    }

    const formConfig = blockFormConfigs[block.type] || {}
    const form = useForm<T>({
        resolver: zodResolver(generateZodSchema(formConfig)),
        defaultValues: block.data as DefaultValues<T>,
    })

    const handleFileOperations = async (data: any) => {
        const updatedData = { ...data };
        
        for (const [field, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                const fileValue = value as FileValue;
                if (fileValue.file) {
                    console.log('Handling file upload for:', field);
                    const fileExt = fileValue.file.name.split('.').pop() || '';
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `block_user_assets/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from("GApe_public")
                        .upload(filePath, fileValue.file);

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        continue;
                    }

                    const { data: publicData } = supabase.storage
                        .from('GApe_public')
                        .getPublicUrl(filePath);

                    updatedData[field] = publicData.publicUrl;
                }
            }
        }

        return updatedData;
    };

    const onSubmit = async (data: any) => {
        const processedData = await handleFileOperations(data);
        onSave({
            ...block,
            data: processedData,
        });
    };

    
    const renderField = (fieldName: string, config: FieldConfig) => {
        return (
            <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as Path<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{config.label}</FormLabel>
                        <FormControl>
                            {config.type === 'upload' ? (
                                <ImageUpload
                                    value={field.value as string}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        form.trigger(fieldName as Path<T>);
                                    }}
                                />
                            ) : config.type === 'textarea' ? (
                                <Textarea {...field} placeholder={config.placeholder} />
                            ) : (
                                <Input 
                                    {...field} 
                                    type={config.type}
                                    placeholder={config.placeholder}
                                />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {Object.entries(formConfig).map(([fieldName, config]) => 
                    renderField(fieldName, config)
                )}
                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </Form>
    )
} 