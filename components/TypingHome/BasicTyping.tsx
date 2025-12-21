
import React from 'react';
import { basicSections } from '@/CommonPage/DeckSelection/basicModeConfig';
import { BasicSection } from '@/CommonPage/DeckSelection/BasicSection';
import { Layout, MainContainer } from '@/Layout'

const BasicModePage: React.FC = () => {
    return (
        <Layout>
            <MainContainer addClass="py-8 px-12 ">
                <div>
                    {basicSections.map((section) => (
                        <BasicSection key={section.id} section={section} />
                    ))}
                </div>
            </MainContainer>
        </Layout>
    );
};

export default BasicModePage;
